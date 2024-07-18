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

const finalMapFolder = path.join(localMapPath, '..', path.basename(localMapPath) + ' [Final]');
if (!fs.existsSync(finalMapFolder)){
    fs.mkdirSync(finalMapFolder);
}

// Copiar los archivos de output a la carpeta local final
diffFileNames.concat("Info").forEach(fileName => {
    const sourceFile = path.join(outputPath, fileName + '.dat');
    const destFile = path.join(finalMapFolder, fileName + '.dat');
    if (fs.existsSync(sourceFile)) {
        if (fileName === "Info") {
            // Read, modify, and write the Info.dat file
            const infoData = readJSON(sourceFile);
            infoData._songName = "[Final] " + infoData._songName;
            writeJSON(destFile, infoData);
        } else {
            fs.copyFileSync(sourceFile, destFile);
        }
        console.log(`Archivo Final ${fileName}.dat copiado a ${finalMapFolder}`);
    }
});

//Copiar song y cover a la carpeta local final
const extraFiles = ['song.ogg','cover.jpg','cover.png'];// TODO Obtener nombres del Info.dat
extraFiles.forEach(fileName => {
    const sourceFile = path.join(localMapPath, fileName);
    const destFile = path.join(finalMapFolder, fileName);
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, destFile);
      console.log(`Archivo Final ${fileName} copiado a ${finalMapFolder}`);
    }
});


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

function combineAndSortArraysV3(arrays) {
    return arrays.flat().sort((a, b) => a.b - b.b);
}

function mergeDiff(diffFileName) {
    let subfolders = fs.readdirSync(partsPath);
    if(subfolders) {
    
        let combinedNotes = [];
        let combinedObstacles = [];
        let combinedBombNotes = [];
        let combinedSliders = [];
        let combinedBurstSliders = [];
        let dataFormat = null;
    
        for (const subfolder of subfolders) {
            const filePath = path.join(partsPath, subfolder, diffFileName + '.dat');
            if (fs.existsSync(filePath)) {
                const data = readJSON(filePath);
                if (data.version.startsWith('2')) {
                    combinedNotes.push(...data._notes);
                    combinedObstacles.push(...data._obstacles);
                } else if (data.version.startsWith('3')) {
                    combinedNotes.push(...data.colorNotes);
                    combinedBombNotes.push(...data.bombNotes);
                    combinedObstacles.push(...data.obstacles);
                    combinedSliders.push(...data.sliders);
                    combinedBurstSliders.push(...data.burstSliders);
                }
                if (!dataFormat) dataFormat = data;
            }
            else {
                console.log("No se encontró la dificultad: " + diffFileName);
                return;
            }
        }

        // Ordenar después de combinar todos los archivos
        if (dataFormat.version.startsWith('2')) {
            combinedNotes = combineAndSortArrays(combinedNotes);
            combinedObstacles = combineAndSortArrays(combinedObstacles);
        }
        else if (dataFormat.version.startsWith('3')) {
            combinedNotes = combineAndSortArraysV3(combinedNotes);
            combinedObstacles = combineAndSortArraysV3(combinedObstacles);
            combinedBombNotes = combineAndSortArraysV3(combinedBombNotes);
            combinedSliders = combineAndSortArraysV3(combinedSliders);
            combinedBurstSliders = combineAndSortArraysV3(combinedBurstSliders);
        }
    
        // Leer el archivo principal y actualizar los arrays
        const filePath = path.join(outputPath, diffFileName+'.dat');

        // Verificar si el archivo principal existe, si no, crear un esqueleto básico para él
        if (!fs.existsSync(filePath)) {
            writeJSON(filePath, dataFormat);
        }

        const mainData = readJSON(filePath);
        if (mainData.version.startsWith('2')) {
            mainData._notes = combinedNotes;
            mainData._obstacles = combinedObstacles;
        } else if (mainData.version.startsWith('3')) {
            mainData.colorNotes = combinedNotes;
            mainData.bombNotes = combinedBombNotes;
            mainData.obstacles = combinedObstacles;
            mainData.sliders = combinedSliders;
            mainData.burstSliders = combinedBurstSliders;
        }
    
        // Escribir el archivo actualizado
        writeJSON(filePath, mainData);
    
        console.log('Se ha creado el archivo combinado '+diffFileName+'.dat con éxito.');

        fs.copyFileSync(mapPath+"/Info.dat", outputPath+"/Info.dat");
    }
}