//Distribution
const shieldedConveyor = extend(Conveyor, "shielded-conveyor",{})
const shieldedJunction = extend(Junction, "shielded-junction",{})
const shieldedOverflowGate = extend(OverflowDuct, "shielded-overflow-gate",{})
const shieldedRouter = extend(DuctRouter, "shielded-router",{})
const shieldedUnderflowGate = extend(OverflowDuct, "shielded-underflow-gate",{})
const transportBridge = extend(DuctBridge, "transport-bridge",{})

//Liquids
const fluidPipeline = extend(ArmoredConduit, "fluid-pipeline",{})

//Power
const powerPole = extend(PowerNode, "power-pole",{})

const thermoGenerator = extend(ThermalGenerator, "thermogenerator",{
    displayEfficiencyScale: 1/9,
    powerProduction: 2/9,
})

//Crafting
const siliconDissolver = extend(GenericCrafter, "silicon-arc-dissolver",{})
const ferronickelForge = extend(GenericCrafter, "ferronickel-forge",{})

//Storage
const coreChamber = extend(CoreBlock, "core-chamber",{})

//Walls
const hematiteWall = extend(Wall, "hematite-wall-small",{})
const hematiteWallLarge = extend(Wall, "hematite-wall-large",{})
const ferronickelWall = extend(Wall, "ferronickel-wall-small",{})
const ferronickelWallLarge = extend(Wall, "ferronickel-wall-large",{})