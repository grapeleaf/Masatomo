//Burst Wall Drill
const wallCrusher = extend(WallCrafter, "wall-crusher", {
    load (){
        this.super$load();

        this.region = Core.atlas.find(this.name)
        this.topRegion = Core.atlas.find(this.name + "-top");
        this.sliderRegion = Core.atlas.find(this.name + "-slider");

        this.stats.remove(Stat.attribute)
        this.stats.remove(Stat.output)

        drillTime = 150
        tier = 1
        //Times faster the drill progresses when boosted by an optional consumer
        optionalBoostIntensity

    }
})