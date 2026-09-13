const resonanceModule = require("resonance/Resonance")

var res = 0;

const resonanceEmitter = extend(GenericCrafter, "resonance-emitter", {
    resonanceRadius: 3,
    resonanceOutput: 25,
    warmupSpeed: 0.15,

    setStats(){
        this.super$setStats();
        this.stats.remove(Stat.output);
        this.stats.remove(Stat.productionTime);
        this.stats.add(Stat.output, this.resonanceOutput , new StatUnit("resonance", "[#f33b77]" + String.fromCharCode(Iconc.layers) + "[]"));
    },

    setBars(){
        this.super$setBars()
        this.addBar("resonance", func(e => 
            new Bar(
                prov(() => Math.floor(res) + "% Resonance"),
                prov(() => Color.valueOf("f33b77")),
                floatp(() => res / this.resonanceOutput)
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
})
resonanceEmitter.buildType = () => extend(GenericCrafter.GenericCrafterBuild, resonanceEmitter,{
    resonanceProduce: 0,

    updateTile(){
        this.super$updateTile()
        let b = resonanceEmitter

        this.resonanceProduce = Mathf.approachDelta(this.resonanceProduce, b.resonanceOutput * this.efficiency, this.block.warmupSpeed * this.delta())
        res = this.resonanceProduce

        //Log.info(this.block.size * b.resonanceRadius * 2)

        resonanceModule.applyResonance(this, this.resonanceProduce)
    },
})