const MasatomoPlanetGenerator = extend(PlanetGenerator, {
    scale: 5,
    octaves: 6,
    persistence: 0.5,
    heightPow: 1.8,
    heightMult: 1.15,
    heightScl: 1.02,

    getHeight(position) {
        return Mathf.pow(this.rawHeight(position), this.heightPow) * this.heightMult;
    },

    rawHeight(position) {
       return Mathf.pow(Simplex.noise3d(46, this.octaves, this.persistence, 1/3, position.x * this.scale, position.y * this.scale, position.z * this.scale) * this.heightScl, this.heightPow);
    },

    rawTemp(position){
        return position.dst(0,0,1)*2.2 - Simplex.noise3d(this.seed, this.octaves, this.persistence, 1.4, 10 + position.x, 10 + position.y, 10 + position.z) * 2.9
    },

    getBlock (position) {
        let slag = Blocks.slag;
        let volcanicBasalt = Vars.content.block("masatomo-volcanic-basalt-wall");
        let basalt = Vars.content.block("masatomo-basalt-wall");
        let sulfur = Vars.content.block("masatomo-sulfuric-wall");
        let feldspar = Vars.content.block("masatomo-feldspar-wall");
        let sinter = Vars.content.block("masatomo-sinter-wall");

        //Erekir method of planet terrain
        let terrain = [slag, slag, slag, slag, slag, slag, volcanicBasalt, volcanicBasalt, slag, slag, volcanicBasalt, basalt, basalt, feldspar, basalt, sulfur, sulfur, sulfur, feldspar];
        
        let slagThres = 2.9;
        let sulfurThres = 0.1;
        let feldThres = 0.03;

        let px = position.x * this.scale;
        let py = position.y * this.scale;
        let pz = position.z * this.scale;

        let temp = this.rawTemp(position);
        let height = this.rawHeight(position);
        height *= 1.2;
        height = Mathf.clamp(height);
        
        let res = terrain[Mathf.clamp(Math.floor(height * terrain.length)), 0, terrain.length - 1];

        if(temp > slagThres){
           res = slag;
        }else if(temp > slagThres - 0.5){
            res = volcanicBasalt;
        }else if(temp > slagThres - 1.35){
            res = basalt;
        };

        if(temp < slagThres - 0.3 && Ridged.noise3d(this.seed + 8, px + 7, py + 7, pz + 7, 3.5, 0.5) > feldThres){
            res = feldspar;
        };

        if(temp < slagThres - 0.3 && Ridged.noise3d(this.seed + 9, px + 2, py + 8, pz + 1, 3, 0.83) > sulfurThres){
            res = sulfur;
        };

        if(temp < 2.5){
            if(res == basalt || res == volcanicBasalt){
                res = sulfur;
            };
        };

        if(temp < 2 && Ridged.noise3d(this.seed + 3, px + 2, py + 8, pz + 1, 8, 0.83) > 0.01){
            if(res == sulfur){
                res = basalt
            };
        };

         if(temp < 0.8){
            res = feldspar;
        };

        return res;
    },

    getColor(position, out) {
        let block = this.getBlock(position);

        if (block == null) {
            block = Blocks.salt;
        };
        out.set(block.mapColor).mulA(1 - block.albedo);
    },
})

const masatomo = extend(Planet, "masatomo", Planets.sun, 1,2, {
    init(){
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
        this.landCloudColor = Color.valueOf("ed6542")
        this.defaultEnv = Env.scorching | Env.terrestrial;
        this.startSector = 11;
        this.atmosphereRadIn = 0.01;
        this.atmosphereRadOut = 0.3;
        this.tidalLock = true;
        this.orbitRadius = 25;
        this.totalRadius += 2.6;
        this.lightSrcTo = 0.5;
        this.lightDstFrom = 0.2;
        this.clearSectorOnLose = true;
        this.defaultCore = Vars.content.block("masatomo-core-chamber");
        this.iconColor = Color.valueOf("f2ff30");
        this.allowLaunchToNumbered = false;
        this.updateLightning = false;
        
        this.defaultAttributes.set(Attribute.heat, 0.5);

        this.ruleSetter = (r) => {
            r.waveTeam = Team.green;
            r.hideSpawns = false;
            r.fog = false;
            r.staticFog = true;
            r.coreDestroyClear = true;
        }
        this.campaignRuleDefaults.fog = false;
        this.campaignRuleDefaults.rtsAI = true;
        this.campaignRuleDefaults.hideSpawns = false;
        this.campaignRuleDefaults.clearSectorOnLose = true;

        this.unlockedOnLand.add(Vars.content.block("masatomo-core-chamber"));
    }
})