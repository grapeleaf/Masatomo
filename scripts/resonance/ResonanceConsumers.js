const resonanceModule = require("resonance/Resonance")

const platinumSeparator = extend(GenericCrafter, "platinum-separator", {
    requiredResonance: 50,

    setStats(){
        this.super$setStats();
        this.stats.add(Stat.input, this.requiredResonance , new StatUnit("resonance", "[#ff4464]" + String.fromCharCode(Iconc.layers) + "[]"));
    },

    setBars(){
        this.super$setBars();
        this.addBar("resonance", func(e => 
            new Bar(
                prov(() => String((Math.floor(e.delegee.resonanceIntake))) + "% Resonance"),
                prov(() => Color.valueOf(Tmp.c1, "ff4464")),
                floatp(() => e.delegee.resonanceIntake / this.requiredResonance)
            )
        ))
    },
})
platinumSeparator.buildType = () => extend(GenericCrafter.GenericCrafterBuild, platinumSeparator, {
    resonanceIntake: 0,
    resonanceInputs: [],

    consumeResonance(){
        if(this.resonanceInputs != null){
            //sum all resonanceInputs then set resonanceIntake to the sum
           let total = this.resonanceInputs.reduce((sum, amount) => sum + amount, 0);
           this.resonanceIntake = total
        }
        this.resonanceInputs.length = 0
    },

    updateTile(){
        //todo: this block still appears to function with resonanceIntake being 0, fix that
        if(this.resonanceIntake < this.block.delegee.requiredResonance){
            this.consumeResonance()
        }

        if(this.efficiency > 0 && this.resonanceIntake > 0){

            this.progress += this.getProgressIncrease(this.block.crafTime);
            warmup = Mathf.approachDelta(this.warmup, this.warmupTarget(), this.block.warmupSpeed);

            if(this.blok.outputLiquids != null){
                let inc = this.getProgressIncrease(1);
                for(let output of this.block.outputLiquids){
                    this.handleLiquid(this, output.liquid, Math.min(output.amount * inc, this.block.liquidCapacity - this.liquids.get(output.liquid)));
                }
            }
            if(this.wasVisible && Mathf.chanceDelta(this.block.updateEffectChance)){
                this.block.updateEffect.at(this.x + Mathf.range(this.block.size * this.block.updateEffectSpread), this.y + Mathf.range(this.block.size * this.block.updateEffectSpread));
            }
        } else {
            this.warmup = Mathf.approachDelta(this.warmup, 0, this.block.warmupSpeed)
        }

        this.totalProgress += this.warmup * Time.delta;

        if(this.progress >= 1){
            this.craft();
        }

        this.dumpOutputs();
    }
})