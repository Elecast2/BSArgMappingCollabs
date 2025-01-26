//importamos el modulo chroma
const chroma = require("./chroma");
const bm = require("./bigmirror");

//ejecutamos la preparacion de chroma
chroma.setupChroma(bm.environmentName, true, true, [], true);

//--- AREA DE TRABAJO ---

chroma.fixStartingLights();
chroma.copyEnvironment(false);


// ---- WORK AREA -------

chroma.disableEnvironmentObject("Spectrograms", "EndsWith");
chroma.disableEnvironmentObject("BigTrackLaneRings", "EndsWith");
chroma.disableEnvironmentObject("NeonTubeDirectionalL", "EndsWith");
chroma.disableEnvironmentObject("NeonTubeDirectionalFL", "EndsWith");
chroma.disableEnvironmentObject("NeonTubeDirectionalR", "EndsWith");
chroma.disableEnvironmentObject("NeonTubeDirectionalFR", "EndsWith");
chroma.disableEnvironmentObject("BackColumns", "EndsWith");
chroma.disableEnvironmentObject("Construction", "EndsWith");
chroma.disableEnvironmentObject("BigTrackLaneRing(Clone)", "EndsWith");
chroma.disableEnvironmentObject("NearBuildingLeft", "EndsWith");
chroma.disableEnvironmentObject("NearBuildingRight", "EndsWith");
chroma.disableEnvironmentObject("DoubleColorLaser", "Contains");
chroma.disableEnvironmentObject("FrontLights", "Contains");

chroma.scaleEnvironmentObject("Floor", "EndsWith", [0.23, 1, 1]);
chroma.trackEnvironmentObject("Floor", "EndsWith", "floor");

chroma._environment.push(
    {
        "id": "CoreLighting",
        "lookupMethod": "EndsWith",
        "rotation": [90,-100,30]
    }
);

bm.setupRotatingLights(true);

chroma.light(10, 0, 1, [1,1,1,1]);
chroma.light(10, 1, 1, [1,1,0,1]);
chroma.light(10, 2, 1, [0,1,1,1]);
chroma.light(10, 3, 1, [0,1,1,1]);
chroma.light(10, 4, 1, [0,0,1,1]);

//Aplicamos chroma a todas las dificultades
chroma.applyChroma();
