
function applyResonance(crafter, resonanceAmount){
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

    for(let x = startX; x <= endX; x++){
        for(let y = startY; y <= endY; y++){
           
            let tile = Vars.world.tile(x,y);

            //skip if block is null
            if(tile == null) continue;
            //skip if block is not solid
            if(!tile.solid()) continue;
            let other = tile.build

            Log.info(crafter.getClass().getName())
            Log.info(other.getClass().getName())
            //skip if block is this block
            if(other === crafter) continue;
            //skip if block produces resonance
            if(other.delegee.resonanceProduce != null) continue;
            //skip if block was already processed in previous iteration
            if(processed.contains(other.id)) continue;
            //skip if block doesnt even consume resonance
            if(other.delegee.resonanceIntake == null) continue;
            

            if(other.delegee.resonanceProduce != null) {
                Log.info(other.efficiency + " p " + other.delegee.resonanceProduce)
            }

            //apply if block consumes resonance
            //doing this just so i dont get confused in the future
            if(other.resonanceIntake != null) {
                processed.add(tile.id);
                other.resonanceIntake += resonanceAmount;
            }
        }
    }
}

module.exports = {
    applyResonance: applyResonance
};