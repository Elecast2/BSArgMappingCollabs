const fs = require('fs');
const path = require('path');

const folderName = process.argv[2];
if (!folderName) {
    console.log('Por favor, especifica el nombre de la carpeta del mapa.');
    return;
}

const mapPath = path.join(__dirname, folderName);
const partsPath = path.join(mapPath, '/Parts');
const outputPath = path.join(mapPath, '/Output');
const localFilePath = path.join(mapPath, 'local_path.txt');
const diffFileNames = ['EasyStandard','NormalStandard','HardStandard','ExpertStandard','ExpertPlusStandard'];

let dataFormat = false;

if(!fs.existsSync(mapPath)) {
    console.log("No hay mapa con ese nombre");
    return;
}

// Verificar si el archivo local_path.txt existe
if (!fs.existsSync(localFilePath)) {
    fs.writeFileSync(localFilePath, 'local_map_path=none\nmapper_folder_name=none');
}

const content = fs.readFileSync(localFilePath, 'utf8');
const localMapLine = content.split('\n')[0];
const mapperFolderLine = content.split('\n')[1];
const localMapPath = localMapLine.split('=')[1];
const mapperFolderName = mapperFolderLine.split('=')[1];

// Verificar si la ruta especificada es una carpeta
if (localMapPath == "none" || mapperFolderName == "none") {
    if (localMapPath == "none") {
        console.log('Aún no has especificado la carpeta local de tu mapa, ve a ./' + folderName 
            + '/local_path.txt y cambia "none" en "local_map_path" por la dirección de tu mapa local');
    }
    if (mapperFolderName == "none") {
        console.log('Aún no has especificado el nombre de la carpeta con tus partes, ve a ./' + folderName 
            + '/local_path.txt y cambia "none" en "mapper_folder_name" por el nombre de la carpeta donde van tus partes. ' +
                'Revisa ./' + folderName + '/Parts');
    }
    return;
}
if (!fs.existsSync(localMapPath) || !fs.lstatSync(localMapPath).isDirectory()) {
    console.log('Error: La ruta especificada en local_path.txt no es válida o no es una carpeta.');
    return;
}

const mapperFolderPath = path.join(partsPath, '/' + mapperFolderName);

if (!fs.existsSync(mapperFolderPath)) {
    console.log('Error: El nombre de la carpeta del mapper especificado en local_path.txt no existe: ' + mapperFolderPath);
    return;
}

// Copiar los archivos locales a la carpeta de partes
diffFileNames.forEach(fileName => {
    const sourceFile = path.join(localMapPath, fileName + '.dat');
    const destFile = path.join(mapperFolderPath, fileName + '.dat');
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, destFile);
      console.log(`Archivo Local ${fileName}.dat copiado a /Parts/${mapperFolderName}.`);
    }
});


if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

for(var i = diffFileNames.length - 1; i >= 0 ; i--) {
    mergeDiff(diffFileNames[i]);
}

//const mapsFolder = path.dirname(localMapPath);


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

function copyLocalToParts(diffFileName) {

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
    
        console.log('Se ha creado el archivo combinado '+diffFileName+'.dat con éxito.');

        fs.copyFileSync(mapPath+"/Info.dat", outputPath+"/Info.dat");
    });
}