//Hydraulic Drill
const hydraulicDrill = extend(BurstDrill, "hydraulic-drill", {
    pistonRegion: null,

    load(){
        this.super$load();
        this.pistonRegion = Core.atlas.find(this.name + "-piston")
    },

    icons(){
        return [this.region, this.pistonRegion];
    },
})
hydraulicDrill.buildType = () => extend(BurstDrill.BurstDrillBuild, hydraulicDrill, {
    draw(){
        this.super$draw();
        let b = hydraulicDrill
        let bfract = Mathf.lerpDelta(0.26, 0.36, Mathf.pow(this.smoothProgress,3))

        Draw.color(Pal.shadow, Pal.shadow.a)
        Draw.rect(b.pistonRegion, this.x - (bfract - 0.26) * 40, this.y - (bfract - 0.26) * 40, b.pistonRegion.width * bfract, b.pistonRegion.height * bfract) 
        
        Draw.z(Layer.blockAdditive)
        Draw.color()
        Draw.rect(b.pistonRegion, this.x, this.y, b.pistonRegion.width * bfract, b.pistonRegion.height * bfract)

        Draw.color(this.dominantItem.color);
        Draw.rect(b.itemRegion, this.x , this.y, b.pistonRegion.width * bfract, b.pistonRegion.height * bfract);
        Draw.color();
    },
})

//Burst Wall Drill
var DrillWave = extend(WaveEffect, {
    sizeFrom: 0.2,
    sizeTo: 20,
    lifetime: 30,
    strokeFrom: 1.1,
    strokeTo: 0.2,
    colorFrom: Color.valueOf("feb380"),
    colorTo: Color.valueOf("feb380"),
})
const wallCrusher = extend(WallCrafter, "wall-crusher", {
    glowRegion: null,

    tier: 3,
    drillHardnessMultiplier: 50,
    drillMultipliers: new ObjectFloatMap(),

    glowColor: Color.valueOf("fc8e6c"),
    drillSound: Sounds.drillImpact,
    drillEffect: Fx.mineBig,

    load (){
        this.super$load();

        this.region = Core.atlas.find(this.name);
        this.underRegion = Core.atlas.find(this.name + "-under");
        this.sliderRegion = Core.atlas.find(this.name + "-slider");
        this.glowRegion = Core.atlas.find(this.name + "-glow");
        
        this.rotatorBottomRegion = Core.atlas.find("clear");
        this.rotatorRegion = Core.atlas.find("clear");
    },

    setStats() {
        this.super$setStats();
        this.stats.remove(Stat.output);
        this.stats.remove(Stat.tiles);
        this.stats.remove(Stat.drillSpeed);

        this.stats.add(
            Stat.drillSpeed,
            60 / this.drillTime * (this.size * this.size),
            StatUnit.itemsSecond
        );

        this.stats.add(
            Stat.drillTier,
            StatValues.drillables(this.drillTime / this.size, 0, this.size, this.drillMultipliers, (b) => {
                let WallOre = (b instanceof StaticWall) && b.itemDrop != null && b.itemDrop.hardness <= this.tier
                let FloorOre = (b instanceof Floor) && b.wallOre && b.itemDrop != null && b.itemDrop.hardness <= this.tier
                return (WallOre || FloorOre);
            })
        );
    },

    getDrillTime(item) {
        return this.drillTime / this.drillMultipliers.get(item, 1);
    },

    canPlaceOn(tile, team, rotation) {
        let got = this.getEfficiency(tile.x, tile.y, rotation, null, null);
        return got.count > 0 && got.item != null;
    },

    drawPlace(x, y, rotation, valid) {
        let got = this.getEfficiency(x, y, rotation, null, null)

        this.drawPlaceText(Core.bundle.formatFloat("bar.drillspeed", 60 / this.drillTime * (got.count * this.size), 2), x, y, valid);
    },

    getEfficiency(tx, ty, rotation, ctile, cpos) {
        let count = 0;
        let item = null;

        let s = this.size;
        let cornerX = tx - Math.floor((s - 1) / 2);
        let cornerY = ty - Math.floor((s - 1 ) / 2);

        for (let i = 0; i < s; i++) {
            let rx = 0;
            let ry = 0;
            
            switch(rotation) {
                case 0:
                    rx = cornerX + s; 
                    ry = cornerY + i;
                    break;
                case 1:
                    rx = cornerX + i;
                    ry = cornerY + s;
                    break;
                case 2:
                    rx = cornerX - 1;
                    ry = cornerY + i;
                    break;
                case 3:
                    rx = cornerX + i;
                    ry = cornerY - 1;
                    break;
            }
            if(cpos != null) {
                cpos.get(rx, ry)
            }
            let other = Vars.world.tile(rx, ry);
            if(other != null && other.solid()) {
                let drop = other.wallDrop();
                if(drop != null && drop.hardness <= this.tier) {
                    count  += 1;
                    item = drop;

                    if(ctile != null) ctile(other)
                }
            }
        }
        return {
            count: count,
            item: item,
        };
    }
})
wallCrusher.buildType = () => extend(WallCrafter.WallCrafterBuild, wallCrusher, {
    smoothProgress: 0,
    drillSound: Sounds.drillImpact,
    steamEffet: Fx.drillSteam,
    drillEffect: [Fx.mineBig, DrillWave],

    updateTile(){
        this.time += this.edelta() * this.efficiency;
        
        let cons = this.shouldConsume();
        
        let got = this.block.getEfficiency(this.tile.x, this.tile.y, this.rotation, null, null);
        let itemCount = (got.count * Mathf.lerp(1, this.block.liquidBoostIntensity, this.block.hasLiquidBooster ? this.optionalEfficiency : 0) * this.block.size);
        let itemDrop = got.item;
       
        this.block.drillTime = this.block.getDrillTime(itemDrop);

        this.lastEfficiency = (itemCount + this.block.size) * this.timeScale * this.efficiency;
        //Log.info(this.items.total() + itemCount)
    
        if(this.items.total() < this.block.itemCapacity - itemCount && this.efficiency > 0) {
            this.warmup = Mathf.approachDelta(this.warmup, this.time / this.block.drillTime, 0.01);
            this.smoothProgress = Mathf.lerpDelta(this.smoothProgress, Mathf.clamp(this.time / (this.block.drillTime - 20)), 0.1);
        } else {
            this.warmup = Mathf.approachDelta(this.warmup, 0, 0.01);
            this.smoothProgress = Mathf.approachDelta(this.smoothProgress, 0, 0.1);
        };

        if(cons && this.items.total() + itemCount < this.block.itemCapacity && this.time >= this.block.drillTime) {
            for(let i = 0; i < (itemCount); i++) {
                this.offload(itemDrop)
            }
            this.time %= this.block.drillTime;

            if(this.wasVisible) {
                let offsX = Geometry.d4x[this.rotation] * ((this.block.size * 8) / 2);
                let offsY = Geometry.d4y[this.rotation] * ((this.block.size * 8) / 2);
                Effect.shake(3, 3, this);
                this.drillSound.at(this.x, this.y, 1 + Mathf.range(0.1), 0.6);
                this.steamEffet.at(this.x + -offsX, this.y + -offsY, this.rotation * 90);
                this.drillEffect.forEach(e => e.at(this.x + offsX, this.y + offsY + Mathf.range(-1), itemDrop.color));
            };
        };

        if(this.timer.get(this.block.timerDump, this.block.dumpTime / this.timeScale)) {
            this.dump()

        };
    },

    draw(){
        //I have to hardcode this
        this.drawCracks();
        let b = wallCrusher;

        let slideDistance = 5;
        let offsX = Geometry.d4x[this.rotation] * -(slideDistance * Mathf.pow(this.smoothProgress, 3));
        let offsY = Geometry.d4y[this.rotation] * -(slideDistance * Mathf.pow(this.smoothProgress, 3));

        Draw.rect(b.underRegion, this.x, this.y);

        Draw.rect(b.sliderRegion, this.x + offsX, this.y + offsY, this.rotdeg());

        Draw.rect(b.region, this.x, this.y);

        Draw.rect(b.topRegion, this.x, this.y, this.rotdeg());

        Tmp.c2.set(b.glowColor)//.mulA(Mathf.pow(this.smoothProgress, 3) * Color.white.a),
        Tmp.c2.a = Mathf.pow(this.smoothProgress, 3) * Color.white.a;

        Draw.blend(Blending.additive);
        Draw.color(Tmp.c2);
        Draw.rect(b.glowRegion, this.x, this.y, this.rotdeg());

        Draw.blend();
        Draw.color();
    },
});
