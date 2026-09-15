const resonanceModule = require("resonance/Resonance")

const resonanceEmitter = extend(GenericCrafter, "resonance-emitter", {
    resonanceRadius: 3,
    resonanceOutput: 25,
    warmupSpeed: 0.15,

    setStats(){
        this.super$setStats();
        this.stats.remove(Stat.output);
        this.stats.remove(Stat.productionTime);
        this.stats.add(Stat.output, this.resonanceOutput , new StatUnit("resonance", "[#ff4464]" + String.fromCharCode(Iconc.layers) + "[]"));
    },

    setBars(){
        this.super$setBars()
        this.addBar("resonance", func(e => 
            new Bar(
                prov(() => String((Math.floor(e.delegee.resonanceProduce))) + "% Resonance"),
                prov(() => Color.valueOf(Tmp.c1, "ff4464")),
                floatp(() => e.delegee.resonanceProduce / this.resonanceOutput)
            )
        ))
    },

    drawPlace(x, y, rotation, valid){
        this.super$drawPlace(x, y, rotation, valid);
        x *= Vars.tilesize,
        y *= Vars.tilesize,
        x += this.offset
        y += this.offset

        Drawf.dashSquare(Pal.accent, x, y, (this.size + this.resonanceRadius * 1.5) * Vars.tilesize)
    },

    applyResonance(crafter, resonanceAmount){
        let processed = new IntSet();

        let rad = crafter.block.delegee.resonanceRadius;
        let size = crafter.block.size;

        let centerX = crafter.tile.x;
        let centerY = crafter.tile.y;

        let cornerX = centerX - (size - 1) / 2;
        let cornerY = centerY - (size - 1) / 2;

        let startX = cornerX - rad;
        let startY = cornerY - rad;

        let endX = cornerX + (size - 1) + rad;
        let endY = cornerY + (size - 1) + rad;

        //check every tile in radius
        for(let x = startX; x <= endX; x++){
            for(let y = startY; y <= endY; y++){
            
                let tile = Vars.world.tile(x,y);
                if(tile != null && tile.solid()) {
                    let build = tile.build

                    if(build.delegee != null) {
                        if(build === crafter) continue;
                        if(build.delegee.resonanceProduce != null) continue;
                        if(processed.contains(build.id)) continue;

                        //add resonanceAmount to consumers resonanceInputs array
                        if(build.delegee.resonanceIntake != null) {
                            processed.add(build.id)
                            build.delegee.resonanceInputs.push(resonanceAmount)
                        }
                    }
                }
            }
        }
    }
})
resonanceEmitter.buildType = () => extend(GenericCrafter.GenericCrafterBuild, resonanceEmitter,{
    resonanceProduce: 0,

    updateTile(){
        this.super$updateTile();

        this.resonanceProduce = Mathf.approachDelta(this.resonanceProduce, this.block.delegee.resonanceOutput * this.efficiency, this.block.warmupSpeed * this.delta());

        if(this.efficiency > 0){
            this.block.applyResonance(this, this.resonanceProduce);
        }
    },
})