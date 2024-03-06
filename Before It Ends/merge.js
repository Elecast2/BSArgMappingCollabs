const fs = require('fs');
const path = require('path');

const partsPath = './Parts';
const diffFileNames = ['EasyStandard','NormalStandard','HardStandard','ExpertStandard','ExpertPlusStandard'];

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
            }
        }
    
        // Ordenar después de combinar todos los archivos
        combinedNotes = combineAndSortArrays(combinedNotes);
        combinedObstacles = combineAndSortArrays(combinedObstacles);
    
        // Leer el archivo principal y actualizar los arrays
        const mainData = readJSON(diffFileName+'.dat');
        mainData._notes = combinedNotes;
        mainData._obstacles = combinedObstacles;
    
        // Escribir el archivo actualizado
        writeJSON(diffFileName+'.dat', mainData);
    
        console.log('Archivo '+diffFileName+'.dat actualizado con éxito.');
    });
}

for(var i = 0; i < diffFileNames.length; i++) {
    mergeDiff(diffFileNames[i]);
}
