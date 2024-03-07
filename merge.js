const fs = require('fs');
const path = require('path');

const mapPath = './' + process.argv[2];

const partsPath = mapPath + '/Parts';
const outputPath = mapPath + '/Output';
const diffFileNames = ['EasyStandard','NormalStandard','HardStandard','ExpertStandard','ExpertPlusStandard'];

let dataFormat = false;

// Función para leer y parsear un archivo JSON
function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Función para escribir un archivo JSON
function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Función para combinar y ordenar los arrays
function combineAndSortArrays(arrays) {
    return arrays.flat().sort((a, b) => a._time - b._time);
}

function mergeDiff(diffFileName) {
    fs.readdir(partsPath, (err, subfolders) => {
        if (err) {
            console.error('Error reading the Parts directory:', err);
            return;
        }
    
        let combinedNotes = [];
        let combinedObstacles = [];

    
        for (const subfolder of subfolders) {
            const filePath = path.join(partsPath, subfolder, diffFileName+'.dat');
            if (fs.existsSync(filePath)) {
                const data = readJSON(filePath);
                combinedNotes.push(...data._notes);
                combinedObstacles.push(...data._obstacles);
                if(!dataFormat) dataFormat = data;
            }
        }

        // Ordenar después de combinar todos los archivos
        combinedNotes = combineAndSortArrays(combinedNotes);
        combinedObstacles = combineAndSortArrays(combinedObstacles);
    
        // Leer el archivo principal y actualizar los arrays
        const filePath = path.join(outputPath, diffFileName+'.dat');

        // Verificar si el archivo principal existe, si no, crear un esqueleto básico para él
        if (!fs.existsSync(filePath)) {
            writeJSON(filePath, dataFormat);
        }

        const mainData = readJSON(filePath);
        mainData._notes = combinedNotes;
        mainData._obstacles = combinedObstacles;
    
        // Escribir el archivo actualizado
        writeJSON(filePath, mainData);
    
        console.log('Archivo '+diffFileName+'.dat actualizado con éxito.');

        fs.copyFileSync(mapPath+"/Info.dat", outputPath+"/Info.dat");
    });
}

if(!fs.existsSync(mapPath)) {
    console.log("No hay mapa con ese nombre");
    return;
}

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

for(var i = diffFileNames.length - 1; i >= 0 ; i--) {
    mergeDiff(diffFileNames[i]);
}
