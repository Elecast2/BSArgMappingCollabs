//importamos el modulo chroma
const chroma = require("./chroma");
const bm = require("./bigmirror");

//ejecutamos la preparacion de chroma
chroma.setupChroma(bm.environmentName, true, true, ["Andres.jpg","Darturr.jpg","Dereknalox123.jpg","Elecast.jpg","Feco.jpg","ManoloReturns.jpg","Qwerty.jpg","Uadyet.jpg"], true);

//--- AREA DE TRABAJO ---

chroma.fixStartingLights();
chroma.copyEnvironment(false);


// ---- WORK AREA -------

chroma.disableEnvironmentObject("Spectrograms", "EndsWith");
chroma.disableEnvironmentObject("NeonTubeDirectionalL", "EndsWith");
chroma.disableEnvironmentObject("NeonTubeDirectionalFL", "EndsWith");
chroma.disableEnvironmentObject("NeonTubeDirectionalR", "EndsWith");
chroma.disableEnvironmentObject("NeonTubeDirectionalFR", "EndsWith");
chroma.disableEnvironmentObject("BackColumns", "EndsWith");
chroma.disableEnvironmentObject("Construction", "EndsWith");
chroma.disableEnvironmentObject("NearBuildingLeft", "EndsWith");
chroma.disableEnvironmentObject("NearBuildingRight", "EndsWith");
chroma.disableEnvironmentObject("DoubleColorLaser", "Contains");
chroma.disableEnvironmentObject("FrontLights", "Contains");

chroma.scaleEnvironmentObject("Floor", "EndsWith", [0.23, 1, 1]);
chroma.trackEnvironmentObject("Floor", "EndsWith", "floor");

bm.setupRings2();
bm.setupRotatingLights();

chroma._environment.push(
    {
        "id": "CoreLighting",
        "lookupMethod": "EndsWith",
        "rotation": [90,-100,30]
    }
);

var depth = 25;
var height = 0;
var logoA = chroma.getGeometryGroupStartData("logoA");
var logoB = chroma.getGeometryGroupStartData("logoB");
var logoC = chroma.getGeometryGroupStartData("logoC");
chroma.moveGeomtetryGroupOS(0, 1, logoA, [-10,height,depth], [0,height,depth], "easeOutCubic");
chroma.moveGeomtetryGroupOS(0.25, 1, logoB, [10,height,depth], [0,height,depth], "easeOutCubic");
chroma.moveGeomtetryGroupOS(0.5, 1, logoC, [10,height,depth], [0,height,depth], "easeOutCubic");

var textA = chroma.getGeometryGroupStartData("textA");
var textB = chroma.getGeometryGroupStartData("textB");
chroma.moveGeomtetryGroupOS(0.75, 1, textA, [-10,height,depth], [0,height,depth], "easeOutCubic");
chroma.moveGeomtetryGroupOS(1, 1, textB, [10,height,depth], [0,height,depth], "easeOutCubic");


chroma.moveGeomtetryGroupOS(2.5, 1.5, logoA, [0,height,depth], [-60,60,depth], "easeOutCubic");
chroma.moveGeomtetryGroupOS(2.6, 1.5, logoB, [0,height,depth], [60,-60,depth], "easeOutCubic");
chroma.moveGeomtetryGroupOS(2.7, 1.5, logoC, [0,height,depth], [60,60,depth], "easeOutCubic");
chroma.moveGeomtetryGroupOS(2.8, 1.5, textA, [0,height,depth], [-60,-60,depth], "easeOutCubic");
chroma.moveGeomtetryGroupOS(2.9, 1.5, textB, [0,height,depth], [0,60,depth], "easeOutCubic");

//Aplicamos chroma a todas las dificultades
chroma.applyChroma(true);
