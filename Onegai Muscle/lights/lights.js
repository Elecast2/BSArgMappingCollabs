//importamos el modulo chroma
const chroma = require("./chroma");
const bm = require("./bigmirror");

//ejecutamos la preparacion de chroma
chroma.setupChroma(bm.environmentName, false, true, [], true);

//--- AREA DE TRABAJO ---

chroma.fixStartingLights();
chroma.copyEnvironment(false);


// ---- WORK AREA -------

chroma.light(10, 0, 1, [1,0,0,1]);

//Aplicamos chroma a todas las dificultades
chroma.applyChroma();
