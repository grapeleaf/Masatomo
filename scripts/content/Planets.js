const MasatomoPlanetGenerator = extend(PlanetGenerator, {
    scale: 2,
    octaves: 8,
    persistence: 0.7,
    heightPow: 2,
    heightMult: 1.2,

    getHeight(position) {
        return Mathf.pow(this.rawHeight(position), this.heightPow) * this.heightMult;
    },

    rawHeight (position) {
       return (Mathf.pow(Simplex.noise3d(46, this.octaves, this.persistence, 1 , position.x * this.scale, position.y * this.scale, position.z * this.scale), this.heightPow) * this.heightMult);
    },

    getBlock (position) {
        //IN ORDER OF HOT TO LESS HOT (THIS IS A HOT PLANET THERE IS NO COLD)
        let slag = Blocks.slag;
        let volcanicBasalt = Vars.content.block("masatomo-volcanic-basalt-wall");
        let basalt = Vars.content.block("masatomo-basalt-wall");
        let sinter = Vars.content.block("masatomo-sinter-wall");
        let sulfur = Blocks.regolithWall;  //temporary
        let feldspar = Vars.content.block("masatomo-feldspar-wall");

        //biome diagram, should probably use erekirs method and not serpulo
        let biomeBlocks = [
            //low to high, left to right
            //hot to less hot, top to bottom
            // ^serpulos whittaker bullcrap apparently
            [slag, slag, slag, slag, volcanicBasalt, slag, basalt, slag ],
            [slag, slag, slag, volcanicBasalt, slag, basalt, slag, slag],
            [slag, slag, basalt, slag, slag, sulfur, sulfur, feldspar],
            [slag, volcanicBasalt, feldspar, basalt, sulfur, feldspar, feldspar, feldspar],
            [basalt, feldspar, basalt, sulfur, feldspar, feldspar, feldspar, feldspar],
            [feldspar, basalt, sulfur, sinter, feldspar, feldspar, feldspar, feldspar],
            [basalt, sulfur, sulfur, feldspar, feldspar, feldspar, feldspar, feldspar],
            [sulfur, sinter, feldspar, feldspar, feldspar, feldspar, feldspar, feldspar],
        ];

        let height = this.rawHeight(position);
        let px = position.x * this.scale;
        let py = position.y * this.scale;
        let pz = position.z * this.scale;

        let rad = this.scale;
        let temp = Mathf.clamp(Math.abs(py * 2) / (rad));
        let tnoise = Simplex.noise3d(this.seed, this.octaves, this.persistence, 1/3, px, py + 999 - 0.1, pz);
        temp = Mathf.lerp(temp, tnoise, 0.5);
        height *= 1.2
        height = Mathf.clamp(height);

        let arr = biomeBlocks
        let res = arr[Mathf.clamp(Math.floor(temp * arr.length), 0, arr[0].length - 1)][Mathf.clamp(Math.floor(height * arr.length), 0, arr[0].length - 1)]
        
        return res;
    },

    getColor(position, out) {
        let block = this.getBlock(position)

        if (block == null) {
            block = Blocks.salt
        }
        out.set(block.mapColor).mulA(1 - block.albedo)
    },
})

const masatomo = extend(Planet, "masatomo", Planets.sun, 1,2, {
    init() {
       this.super$init();
       this.localizedName = "Masatomo"

       let div = 5

       this.generator = MasatomoPlanetGenerator;
       this.meshLoader = () => new HexMesh(this, div);
       this.cloudMeshLoader = () => {
        return new MultiMesh(
            new HexSkyMesh(this, 2, 3, 0.1, div, Color.valueOf("cb941c").mulA(0.5), 2, 0.42, 1.4, 0.35),
            new HexSkyMesh(this, 2, 1.5, 0.11, div, Color.valueOf("c79f27").mulA(0.5), 2, 0.42, 1.2, 0.4),
            new HexSkyMesh(this, 2, 0.6, 0.12, div, Color.valueOf("c7b42e").mulA(0.5), 2, 0.42, 1, 0.45),
        );
       };

       this.alwaysUnlocked = true;
       this.atmosphereColor = Color.valueOf("6c6009").mulA(0.5)
       this.defaultEnv = Env.scorching | Env.terrestrial;
       this.startSector = 11;
       this.atmosphereRadIn = 0.02;
       this.atmosphereRadOut = 0.3;
       this.tidalLock = true;
       this.orbitSpacing = 2;
       this.totalRadius += 2.6;
       this.lightSrcTo = 0.5;
       this.lightDstFrom = 0.2;
       this.clearSectorOnLose = true;
       this.defaultCore = Vars.content.block("masatomo-core-chamber");
       this.iconColor = Color.valueOf("f2ff30");
       this.allowLaunchToNumbered = false;
       this.updateLightning = false;
       
       this.defaultAttributes.set(Attribute.heat, 0.5);
    }
})