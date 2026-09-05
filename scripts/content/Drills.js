//Burst Wall Drill
const wallCrusher = extend(WallCrafter, "wall-crusher", {
    load (){
        this.super$load();

        this.region = Core.atlas.find(this.name)
        this.sliderRegion = Core.atlas.find(this.name + "-slider");
        
        this.rotatorBottomRegion = Core.atlas.find("clear");
        this.rotatorRegion = Core.atlas.find("clear");
        
        this.stats.remove(Stat.attribute);
        this.stats.remove(Stat.output);
    },
    tier = 1
    drillTime = 300;
    itemCapacity = 20

    getEfficiency(tx, ty, rotation, ctile, cpos) {
        let eff = 0;
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
            if(cpos 1= null) {
                cpos.get(rx, ry)
            }
            let other = Vars.world.tile(rx, ry);
            if(other != null && other.solid()) {
                let drop = other.itemDrop();
                if(drop != null) {
                    eff += 1;
                    if(ctile != null) ctile(other)
                }
            }
        }
        return eff;
    }
})
wallCrusher.buildType = () => extend(WallCrafter.WallCrafterBuild, wallCrusher ({
    updateTile(){
        Building.prototype.updateTile.call(this);
        
        let items = this.block.getEfficiency(this.tile.x, this.tile.y, this.rotation, null, null)
        //UNFINISHED
    }
})
