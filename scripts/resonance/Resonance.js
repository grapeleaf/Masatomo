
function applyResonance(build, resonanceAmount){
    let processed = new IntSet();

    let rad = build.block.resonanceRadius;
    let size = build.block.size;

    let centerX = build.tile.x;
    let centerY = build.tile.y;

    let cornerX = centerX - (size - 1) / 2;
    let cornerY = centerY - (size - 1) / 2;

    let startX = cornerX - rad;
    let startY = cornerY - rad;

    let endX = cornerX + (size - 1) + rad;
    let endY = cornerY + (size - 1) + rad;

    for(let x = startX; x <= endX; x++){
        for(let y = startY; y <= endY; y++){

            let tile = Vars.world.tile(x,y);
            if(tile == null) continue;

            let other = tile.build;

            //skip if block is null
            if(other == null) continue;
            //skip if block is this block
            if(other === build) continue;
            //skip if block produces resonance
            if(other.resonanceProduce != null) continue;
            //skip if block was already processed in previous iteration
            if(processed.contains(other.id)) continue;

            //apply if block consumes resonance
            //doing this just so i dont get confused in the future
            if(other.resonanceIntake != null) {
                processed.add(other.id);
                other.resonanceIntake += resonanceAmount;
            }
        }
    }
}

module.exports = {
    applyResonance: applyResonance
};