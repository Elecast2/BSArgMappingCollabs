//Version 04/08/2023

const path = require('path')
const fs = require('fs');
const { on } = require('events');

var difficulties = [];
var folder;

var _events = [];
var _customEvents = [];
var _pointDefinitions = [];
var _environment = [];

var fakeColorNotes = [];

var materials = {};

var v3 = false;

var _BPMChanges = [];
var bpm;

var baseDir;

module.exports = {

    _events,
    _customEvents,
    _pointDefinitions,
    _environment,
    fakeColorNotes,
    materials,
    folder,
    v3,

    GeometryObject,
    
    _BPMChanges,

    setMaterials: function (mat) {
        materials = mat;
    },

    setupChroma: function (environmentName, putChromaPrefix, putSettings, extraFiles, _v3) {

        v3 = _v3;
        //creamos una carpeta output para colocar los .dat con las luces

        const localFilePath = path.join('../local_path.txt');
        const content = fs.readFileSync(localFilePath, 'utf8');
        const localMapLine = content.split('\n')[0];
        baseDir = localMapLine.split('=')[1] + " [Final]";

        console.log("Copying the map into " + baseDir + " [Chroma]");
        folder = path.join(baseDir, '..', path.basename(baseDir) + ' [Chroma]');
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder);
        }
        //copiamos los archivos dentro de la nueva carpeta para editar las copias y no los originales
        //Copiamos el info.dat
        copyFile("Info.dat");

        //Cargamos el Info.dat
        var infoDatFile = path.join(folder, 'Info.dat');
        let infoDat = JSON.parse(fs.readFileSync(infoDatFile));

        //Agregamos [Chroma] al nombre de la cancion para diferenciarlo ingame
        if(putChromaPrefix) {
            infoDat._songName = '[Chroma] ' + infoDat._songName;
        }
        //colocamos environment
        infoDat._environmentName = environmentName;
        //colocamos los contributors TODO: (hacer opcion separada)
        
        /*infoDat._customData._contributors = [];
        infoDat._customData._contributors.push(
			{
				"_role": "Mapper",
				"_name": "Dereknalox123",
				"_iconPath": "derek.jpg"
			},
			{
				"_role": "Lighter",
				"_name": "Elecast",
				"_iconPath": "ele.jpg"
			}
        );*/
        //infoDat._customData._editors TODO AÑADIR QUE SALGA EL EDITOR CON LA VERSION DEL CHROMA.JS Y LAST EDITED BY
        //colocamos el suggestion de Chroma
        for(var i = 0; i < infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps.length; i++) {
            if(!infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData) {
                infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData = {};
                infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData._suggestions = {};
                infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData._settings = {};
            }
            infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData._suggestions = ["Chroma"];
            //colocamos las settings
            if(putSettings) {
                infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData._settings = {
                    "_playerOptions": {
                        "_environmentEffectsFilterDefaultPreset": "AllEffects",
                        "_environmentEffectsFilterExpertPlusPreset": "AllEffects",
                        "_leftHanded": false
                    },
                    "_environments": {
                        "_overrideEnvironments": false
                    },
                    "_chroma": {
                        "_disableChromaEvents": false,
                        "_disableEnvironmentEnhancements": false,
                        "_disableNoteColoring": false
                    },
                    "_graphics": {
                        "_smokeGraphicsSettings": 1
                    }
                };
            }
        }

        //Guardamos el bmp para algunos usos
        bpm = infoDat._beatsPerMinute;

        //guardamos el Info.dat
        fs.writeFileSync(infoDatFile, JSON.stringify(infoDat, null, 0));

        //Copiamos la musica y el cover
        copyFile(infoDat._songFilename);
        copyFile(infoDat._coverImageFilename);

        //Copiar las imagenes de contributors y archivos extra
        extraFiles.forEach(d => copyFile(d));

        //Obtenemos los archivos de las dificultades de Info.dat
        difficulties = infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps.map(item => item._beatmapFilename);

        //Copiamos las dificultades
        difficulties.forEach(d => copyFile(d));
        console.log("Chroma setup is ready!");
    },

    copyEnvironment: function(v2) {
        let difficulty = JSON.parse(fs.readFileSync("Environment.json"));
        if(v2) {
            for(var i = 0; i < difficulty._customData._environment.length; i++) {
                _environment.push(difficulty._customData._environment[i]);
              }
              if(difficulty._customData._customEvents) {
                  for(var i = 0; i < difficulty._customData._customEvents.length; i++) {
                      _customEvents.push(difficulty._customData._customEvents[i]);
                    }
              }
              this.setMaterials(difficulty._customData._materials);
        }
        else {
            for(var i = 0; i < difficulty.customData.environment.length; i++) {
                _environment.push(difficulty.customData.environment[i]);
              }
              if(difficulty.customData.customEvents) {
                  for(var i = 0; i < difficulty.customData.customEvents.length; i++) {
                      _customEvents.push(difficulty.customData.customEvents[i]);
                    }
              }
              this.setMaterials(difficulty.customData.materials);
        }
        
        
    },

    loadBPMChanges: function() {
        let difficulty = JSON.parse(fs.readFileSync("ExpertPlusStandard.dat"));
        this._BPMChanges = difficulty._customData._BPMChanges;
    },

    getTimeBPM: function(time) {
        var bpms = this._BPMChanges;
        var beatCount = 0;
        var currentTime = 0;
        var currentBPM = bpm;
        var nextBPM;
        for(var i = 0; i < bpms.length; i++) {
            nextBPM = bpms[i];
            var distance = (nextBPM._time - currentTime)*(currentBPM/bpm);
            if((beatCount+distance) >= time) {
                break;
            }
            beatCount += distance;
            currentBPM = nextBPM._BPM;
            currentTime = nextBPM._time;
        }
        currentTime += (time-beatCount)*(bpm/currentBPM);
        return currentTime;
    },

    fixBPM: function(offset) {
        if(offset) {
            for(var i = 0; i < _events.length; i++) {
                _events[i]._time += offset;
                if(_events[i]._time < 0) {
                    _events[i]._time = 0;
                }
            }
            for(var i = 0; i < _customEvents.length; i++) {
                _customEvents[i]._time += offset;
                if(_customEvents[i]._time < 0) {
                    _customEvents[i]._time = 0;
                }
            }
        }
        else {
            for(var i = 0; i < _events.length; i++) {
                _events[i]._time = this.getTimeBPM(_events[i]._time);
            }
            for(var i = 0; i < _customEvents.length; i++) {
                _customEvents[i]._time = this.getTimeBPM(_customEvents[i]._time);
            }
        }
    },

    setStaticNoteColors: function(leftColor, rightColor, force) {
        var infoDatFile = path.join(folder, 'Info.dat');
        let infoDat = JSON.parse(fs.readFileSync(infoDatFile));
        for(var i = 0; i < infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps.length; i++) {
            infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData._colorLeft = {"r": leftColor[0], "g": leftColor[1], "b": leftColor[2]};
            infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData._colorRight = {"r": rightColor[0], "g": rightColor[1], "b": rightColor[2]};
        }
        fs.writeFileSync(infoDatFile, JSON.stringify(infoDat, null, 0));
        if(force) {
            difficulties.forEach(d => applyForcedNoteColorsToFile(path.join(folder, d), leftColor, rightColor));
        }
    },

    setNoteColorsTimed: function(leftColor, rightColor, fromBeat, toBeat) {
        difficulties.forEach(d => applyForcedNoteColorsToFile(path.join(folder, d), leftColor, rightColor, true, fromBeat, toBeat));
    },

    setStaticObstacleColor: function(obstacleColor, force) {
        var infoDatFile = path.join(folder, 'Info.dat');
        let infoDat = JSON.parse(fs.readFileSync(infoDatFile));
        for(var i = 0; i < infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps.length; i++) {
            infoDat._difficultyBeatmapSets[0]._difficultyBeatmaps[i]._customData._obstacleColor = {"r": obstacleColor[0], "g": obstacleColor[1], "b": obstacleColor[2]};
        }
        fs.writeFileSync(infoDatFile, JSON.stringify(infoDat, null, 0));
        if(force) {
            difficulties.forEach(d => applyForcedObstacleColorToFile(path.join(folder, d), obstacleColor));
        }
    },

    applyChroma: function (keepEvents) {
        //Ordenamos events por beat y aplicamos el chroma a los .dat
        var trackObjects = 0;
        for(var i = 0; i < _environment.length; i++) {
            if(_environment[i].track) {
                trackObjects++;
            }
        }
        console.log("Applying Chroma [Events = " + (_events.length + _customEvents.length) + ", Environment = "+_environment.length + ", Tracks = " + trackObjects + "]");
        if(v3) {
            _events.sort((a, b) => a.b - b.b);
        }
        else{
            _events.sort((a, b) => a._time - b._time);
        }
        difficulties.forEach(d => applyChromaToFile(path.join(folder, d), keepEvents));
    },

    addPointDefinition: function(name, points) {
        var pointDef = {};
        pointDef._name = name;
        pointDef._points = points;
        _pointDefinitions.push(pointDef);
    },

    light: function (time, type, value, color, id) {
        this.pushLightEvent(time, type, value, color, id);
    },

    timedLight: function (time, type, duration, color, id) {
        this.pushLightEventT(time, type, duration, color, id);
    },

    pushLightEvent: function (time, type, value, color, id) {
        lightEvent(time, type, value, color, id);
    },

    pushLightEventT: function (time, type, duration, color, id) {
        lightEvent(time, type, 1, color, id);
        lightEvent(time+duration, type, 0, null, id);
    },

    fade: function (time, type, color, id) {
        lightEvent(time, type, 3, color, id);
    },

    pushFadeEvent: function (time, type, color, id) {
        lightEvent(time, type, 3, color, id);
    },

    stepFade: function (time, type, duration, color, id, strobe, res) {
        this.pushStepFadeEvent(time, type, duration, color, id, strobe, res);
    },

    stepFadeUp: function (time, type, duration, color, id, strobe, res) {
        this.pushStepFadeEventUp(time, type, duration, color, id, strobe, res);
    },

    strobeFadeWall: function (time, duration, startColor, resolution) {
        if(startColor.length == 3) {
            startColor = startColor.concat(1);
        }
        let endColor = [0,0,0,0];
        let timeStep = duration/resolution;
        let rStep = (endColor[0]-startColor[0])/resolution;
        let gStep = (endColor[1]-startColor[1])/resolution;
        let bStep = (endColor[2]-startColor[2])/resolution;
        for(var i = 0; i < resolution; i++) {
            let color = [startColor[0] + i*rStep, startColor[1] + i*gStep, startColor[2] + i*bStep];
            let alphaStep = (endColor[3] - startColor[3])/resolution;
            color = color.concat(startColor[3] + i*alphaStep);
            t = i*timeStep;
            instantWallColorChange(time + t, color);
            var nextTime = (i+1)*timeStep;
            var durationT = (nextTime-t)/2;
            instantWallColorChange(time + t + durationT, [0,0,0,0]);
        }
        instantWallColorChange(time + duration - 0.001, [0,0,0,0]);
    },

    pushStepFadeEvent: function (time, type, duration, color, id, strobe, res) {
        var _res = 8
        if(res) {
            _res = res;
        }
        this.pushLightStepGradientEventRGB(time, type, id, duration, color, [color[0],color[1],color[2],0], Math.floor(duration*_res), false, strobe);
    },

    pushStepFadeEventUp: function (time, type, duration, color, id, strobe, res) {
        var _res = 8
        if(res) {
            _res = res;
        }
        this.pushLightStepGradientEventRGB(time, type, id, duration, [color[0],color[1],color[2],0], color, Math.floor(duration*_res), false, strobe);
    },

    //No funciona con Ids en v2, probar en v3
    pushLightGradientEvent: function (time, type, duration, startColor, endColor, easing, id) {
        if(v3) {
            const event = {};
            event.b = time;
            event.et = type;
            event.i = 1;
            event.f = 1;
            event.customData = {};
            event.customData.lightID = id;
            event.customData.color = startColor;

            const event2 = {};
            event2.b = time+(duration*0.995);
            event2.et = type;
            event2.i = 4;
            event2.f = 1;
            event2.customData = {};
            event2.customData.lightID = id;
            event2.customData.color = endColor;
            event2.customData.easing = easing;
            event2.customData.lerpType = "HSV";

            _events.push(event);
            _events.push(event2);
        }
        else {
            const event = {};
            event._time = time;
            event._type = type;
            event._value = 1;
            event._customData = {};
            event._customData._lightGradient = {};
            event._customData._lightGradient._duration = duration;
            event._customData._lightGradient._startColor = startColor;
            event._customData._lightGradient._endColor = endColor;
            event._customData._lightGradient._easing = easing;
            _events.push(event);
        }
        
    },

    //Si funciona con Ids (Ocupa mas espacio en el json)
    //type = -1 = walls
    pushLightStepGradientEvent: function (time, type, id, duration, startColor, endColor, resolution, easing, strobe, fadeStrobe) {
        if(startColor.length == 3 && endColor.length == 4) {
            startColor = startColor.concat(1);
        }
        if(startColor.length == 4 && endColor.length == 3) {
            endColor = endColor.concat(1);
        }
        let timeStep = duration/resolution;
        let hsvStart = RGBtoHSV(startColor[0], startColor[1], startColor[2]);
        let hsvEnd = RGBtoHSV(endColor[0], endColor[1], endColor[2]);
        let h1 = hsvStart.h/360;
        let s1 = hsvStart.s/100;
        let v1 = hsvStart.v/100;
        let h2 = hsvEnd.h/360;
        let s2 = hsvEnd.s/100;
        let v2 = hsvEnd.v/100;
        let hStep = (h2-h1)/resolution;
        let sStep = (s2-s1)/resolution;
        let vStep = (v2-v1)/resolution;
        for(var i = 0; i < resolution; i++) {
            let color = HSVtoRGB(h1 + i*hStep, s1 + i*sStep, v1 + i*vStep);
            if(startColor.length == 4 && endColor.length == 4){
                let alphaStep = (endColor[3] - startColor[3])/resolution;
                color = color.concat(startColor[3] + i*alphaStep);
            }
            t = i*timeStep;
            if(easing) {
                t = easeOutCubic(0, duration, (i*timeStep)/duration);
            }
            if(type == -1) {
                instantWallColorChange(time + t, color);
            }
            else {
                if(fadeStrobe) {
                    lightEvent(time + t, type, 3, color, id);
                }
                else {
                    lightEvent(time + t, type, 1, color, id);
                    if(strobe) {
                        var nextTime = (i+1)*timeStep;
                        if(easing) {
                            nextTime = easeOutCubic(0, duration, ((i+i)*timeStep)/duration);
                        }
                        var durationT = (nextTime-t)/2;
                        lightEvent(time + t + durationT, type, 0, null, id);
                    }
                }
                
            }
        }
        if(!fadeStrobe && !strobe) {
            lightEvent(time + duration - 0.001, type, 1, endColor, id);
        }
        
    },

    pushLightStepGradientEventRGB: function (time, type, id, duration, startColor, endColor, resolution, easing, strobe) {
        if(startColor.length == 3 && endColor.length == 4) {
            startColor = startColor.concat(1);
        }
        if(startColor.length == 4 && endColor.length == 3) {
            endColor = endColor.concat(1);
        }
        let timeStep = duration/resolution;
        let rStep = (endColor[0]-startColor[0])/resolution;
        let gStep = (endColor[1]-startColor[1])/resolution;
        let bStep = (endColor[2]-startColor[2])/resolution;
        for(var i = 0; i < resolution; i++) {
            let color = [startColor[0] + i*rStep, startColor[1] + i*gStep, startColor[2] + i*bStep];
            if(startColor.length == 4 && endColor.length == 4){
                let alphaStep = (endColor[3] - startColor[3])/resolution;
                color = color.concat(startColor[3] + i*alphaStep);
            }
            t = i*timeStep;
            if(easing) {
                t = easeOutCubic(0, duration, (i*timeStep)/duration);
            }
            if(type == -1) {
                instantWallColorChange(time + t, color);
            }
            else {
                lightEvent(time + t, type, 1, color, id);
                if(strobe) {
                    var nextTime = (i+1)*timeStep;
                    if(easing) {
                        nextTime = easeOutCubic(0, duration, ((i+i)*timeStep)/duration);
                    }
                    var durationT = (nextTime-t)/2;
                    lightEvent(time + t + durationT, type, 0, null, id);
                }
            }
        }
        lightEvent(time + duration - 0.001, type, 1, endColor, id);
    },

    linearStrobe(time, type, ids, period, duration, color, back) {
        for(var i = 0; i < ids.length; i++) {
            var val = i;
            if(back) {
                val = ids.length - (i+1);
            }
            this.pushLightEventT(time + i*period, type, duration, color, ids[val]);
        }
    },

    linearStrobeAdvanced(time, type, ids, period, duration, color, back, limit, offset) {
        var count = 0;
        for(var i = offset; i < ids.length+offset; i++) {
            var val = i;
            if(back) {
                val = ids.length - (i+1);
            }
            if(val < 0){
                val = ids.length - val;
            }
            if(val >= ids.length) {
                val = val - ids.length;
            }
            this.pushLightEventT(time + count*period, type, duration, color, ids[val]);
            count++;
            if(count == limit) {
                break;
            }
        }
    },

    //rotation =  cuantos grados rota el primer anillo (Siempre positivo, para invertir la rotacion usar direction)
    //step = cuantos grados se le van sumando a los siguientes anillos (v2: No tiene en cuenta el direction, asi que si direction es 0, entonces poner esto en negativo)
    //prop =  cuanto tardan los siguientes anillos en reaccionar (el numero es invertido, es decir a mayor numero, mas rapido reaccionan)
    //speed = que tan rapido rota cada anillo desde el angulo inicial al angulo final
    //direction = 1: reloj, 0: contrareloj
    //Online viewer: https://chromapper.atlassian.net/wiki/spaces/UG/pages/7077895/Precision+ring+control
    pushRingRotationEvent: function (time, rotation, step, prop, speed, direction) {
        if(v3) {
            const event = {};
            event.b = time;
            event.et = 8;
            event.i = 0;
            event.f = 0;
            event.customData = {};
            event.customData.rotation = rotation;
            event.customData.step = step;
            event.customData.prop = prop;
            event.customData.speed = speed;
            /*event.customData.direction = direction;*/
            _events.push(event);
        }
        else {
            const event = {};
            event._time = time;
            event._type = 8;
            event._value = 0;
            event._customData = {};
            event._customData._rotation = rotation;
            event._customData._step = step;
            event._customData._prop = prop;
            event._customData._speed = speed;
            event._customData._direction = direction;
            _events.push(event);
        }
    },

    //"step": (float) Dictates how much position offset is added between each ring.
    //"speed": (float) Dictates how quickly it will move to its new position.
    pushRingZoomEvent: function (time, step, speed) {
        if(v3) {
            const event = {};
            event.b = time;
            event.et = 9;
            event.i = 0;
            event.f = 1;
            event.customData = {};
            event.customData.step = step;
            event.customData.speed = speed;
            _events.push(event);
        }
        else {
            const event = {};
            event._time = time;
            event._type = 9;
            event._value = 0;
            event._customData = {};
            event._customData._step = step;
            event._customData._speed = speed;
            _events.push(event);
        }
    },

    pushBothLasersRotationEvent : function(time, speed, lockRotation, direction) {
        this.pushLeftLasersRotationEvent(time, speed, lockRotation, direction);
        this.pushRightLasersRotationEvent(time, speed, lockRotation, direction);
    },

    pushLeftLasersRotationEvent: function(time, speed, lockRotation, direction) {
        if(v3) {
            _events.push(
                {
                  "b": time,
                  "et": 12,
                  "i": 1,
                  "f": 1,
                  "customData": {
                    "speed": speed,
                    "lockRotation": lockRotation,
                    "direction": direction
                  }
                }
            );
        }
        else{
            _events.push(
                {
                  "_time": time,
                  "_type": 12,
                  "_value": 1,
                  "_customData": {
                    "_speed": speed,
                    "_lockPosition": lockRotation,
                    "_direction": direction
                  }
                }
            );
        }
    },

    pushRightLasersRotationEvent: function(time, speed, lockRotation, direction) {
        if(v3) {
            _events.push(
                {
                  "b": time,
                  "et": 13,
                  "i": 1,
                  "f": 1,
                  "customData": {
                    "speed": speed,
                    "lockRotation": lockRotation,
                    "direction": direction
                  }
                }
            );
        }
        else {
            _events.push(
                {
                  "_time": time,
                  "_type": 13,
                  "_value": 1,
                  "_customData": {
                    "_speed": speed,
                    "_lockPosition": lockRotation,
                    "_direction": direction
                  }
                }
            );
        }
    },

    disableBothLasersRotation: function(time) {
        if(v3) {
            _events.push(
                {
                    "b": time,
                    "et": 12,
                    "i": 0,
                    "f": 1,
                    "customData": {
                      "speed": 0,
                      "lockRotation": 0,
                      "direction": 0
                    }
                },
                {
                    "b": time,
                    "et": 13,
                    "i": 0,
                    "f": 1,
                    "customData": {
                      "speed": 0,
                      "lockRotation": 0,
                      "direction": 0
                    }
                }
            );
        }
        else {
            _events.push(
                {
                    "_time": time,
                    "_type": 12,
                    "_value": 0,
                    "_customData": {
                      "_speed": 0,
                      "_lockPosition": 0,
                      "_direction": 0
                    }
                },
                {
                    "_time": time,
                    "_type": 13,
                    "_value": 0,
                    "_customData": {
                      "_speed": 0,
                      "_lockPosition": 0,
                      "_direction": 0
                    }
                }
            );
        }
    },

    disableEnvironmentObject: function(id, lookupMethod) {
        if(v3) {
            _environment.push(
                {
                    "id": id,
                    "lookupMethod": lookupMethod,
                    "active": false
                }
            );
        }
        else {
            _environment.push(
                {
                    "_id": id,
                    "_lookupMethod": lookupMethod,
                    "_active": false
                }
            );
        }
    },

    scaleEnvironmentObject: function(id, lookupMethod, scale) {
        if(v3) {
            _environment.push(
                {
                    "id": id,
                    "lookupMethod": lookupMethod,
                    "scale": scale
                }
            );
        }
        else {
            _environment.push(
                {
                    "_id": id,
                    "_lookupMethod": lookupMethod,
                    "_scale": scale
                }
            );
        }
    },

    rotateEnvironmentObject: function(id, lookupMethod, rotation) {
        if(v3) {
            _environment.push(
                {
                    "id": id,
                    "lookupMethod": lookupMethod,
                    "rotation": rotation
                }
            );
        }
        else {
            _environment.push(
                {
                    "_id": id,
                    "_lookupMethod": lookupMethod,
                    "_rotation": rotation
                }
            );
        }
    },

    positionEnvironmentObject: function(id, lookupMethod, position) {
        if(v3) {
            _environment.push(
                {
                    "id": id,
                    "lookupMethod": lookupMethod,
                    "position": position
                }
            );
        }
        else {
            _environment.push(
                {
                    "_id": id,
                    "_lookupMethod": lookupMethod,
                    "_position": position
                }
            );
        }
    },

    positionAndRotateEnvironmentObject: function(id, lookupMethod, position, rotation) {
        if(v3) {
            _environment.push(
                {
                    "id": id,
                    "lookupMethod": lookupMethod,
                    "position": position,
                    "rotation": rotation
                }
            );
        }
        else {
            _environment.push(
                {
                    "_id": id,
                    "_lookupMethod": lookupMethod,
                    "_position": position,
                    "_rotation": rotation
                }
            );
        }
    },

    trackEnvironmentObject: function(id, lookupMethod, track) {
        if(v3) {
            _environment.push(
                {
                    "id": id,
                    "lookupMethod": lookupMethod,
                    "track": track
                }
            );
        }
        else {
            _environment.push(
                {
                    "_id": id,
                    "_lookupMethod": lookupMethod,
                    "_track": track
                }
            );
        }
    },

    prepareWallsForColorGradients: function() {
        difficulties.forEach(d => prepareFileForWallGradients(path.join(folder, d)));
    },

    pushWallColorGradient: function(time, duration, startColor, endColor) {
        if(v3) {
            _customEvents.push(
                {
                    "b": time,
                    "t": "AnimateTrack",
                    "d": {
                        "track": "w",
                        "duration": duration,
                        "color": [
                            startColor.concat(0),
                            endColor.concat(1).concat("easeOutSine")
                        ]
                    }
                }
            );
        }
        else {
            _customEvents.push(
                {
                    "_time": time,
                    "_type": "AnimateTrack",
                    "_data": {
                        "_track": "w",
                        "_duration": duration,
                        "_color": [
                            startColor.concat(0),
                            endColor.concat(1).concat("easeOutSine")
                        ]
                    }
                }
            );
        }
    },

    assingTrackParent: function(time, childrenTracks, parentTrack, worldPositionStays) {
        const event = {};
        event.b = time;
        event.t = "AssignTrackParent";
        event.d = {};
        event.d.childrenTracks = childrenTracks;
        event.d.parentTrack = parentTrack;
        event.d.worldPositionStays = worldPositionStays;
        _customEvents.push(event);
    },

    assingTrackParentObjects: function(time, objects, parentTrack, worldPositionStays) {
        var tracks = [];
        for(var i = 0; i < objects.length; i++) {
            tracks.push(objects[i].track);
        }
        this.assingTrackParent(time, tracks, parentTrack, worldPositionStays);
    },

    animateColor: function(time, duration, track, colorFrames) {
        const event = {};
        if(v3) {
            event.b = time;
            event.t = "AnimateTrack";
            event.d = {};
            event.d.track = track;
            event.d.duration = duration;
            event.d.color = colorFrames;
            _customEvents.push(event);
        }
        else {
            //todo?
        }
    },

    animateObject: function(time, duration, track, positionFrames, rotationFrames, scaleFrames, local) {
        const event = {};
        if(v3) {
            
            event.b = time;
            event.t = "AnimateTrack";
            event.d = {};
            event.d.track = track;
            event.d.duration = duration;
            if(positionFrames) {
                if(local) {
                    event.d.localPosition = positionFrames;
                }
                else {
                    event.d.position = positionFrames;
                }
            }
            if(rotationFrames) {
                if(local) {
                    event.d.localRotation = rotationFrames;
                }
                else {
                    event.d.rotation = rotationFrames;
                }
            }
            if(scaleFrames) {
                event.d.scale = scaleFrames;
            }
            _customEvents.push(event);
        }
        else {
            event._time = time;
            event._type = "AnimateTrack";
            event._data = {};
            event._data._track = track;
            event._data._duration = duration;
            if(positionFrames) {
                if(local) {
                    event._data._localPosition = positionFrames;
                }
                else {
                    event._data._position = positionFrames;
                }
            }
            if(rotationFrames) {
                if(local) {
                    event._data._localRotation = rotationFrames;
                }
                else {
                    event._data._rotation = rotationFrames;
                }
            }
            if(scaleFrames) {
                event._data._scale = scaleFrames;
            }
            _customEvents.push(event);
        }
    },

    moveObject: function(time, duration, track, from, to, easing) {
        if(easing) {
            this.animateObject(time, duration, track, [from.concat(0),to.concat(1,easing)], null, null, false);
        }
        else {
            this.animateObject(time, duration, track, [from.concat(0),to.concat(1)], null, null, false);
        }
    },

    moveObjectLocal: function(time, duration, track, from, to, easing) {
        if(easing) {
            this.animateObject(time, duration, track, [from.concat(0),to.concat(1,easing)], null, null, true);
        }
        else {
            this.animateObject(time, duration, track, [from.concat(0),to.concat(1)], null, null, true);
        }
    },

    teleportObject: function(time, track, position) {
        this.animateObject(time, 0, track, position, null, null, false);
    },

    teleportObjectLocal: function(time, track, position) {
        this.animateObject(time, 0, track, position, null, null, true);
    },

    transformObject: function(time, track, position, rotation, scale, local) {
        this.animateObject(time, 0, track, position, rotation, scale, local);
    },

    rotateObject: function(time, duration, track, from, to, easing, local) {
        if(easing) {
            this.animateObject(time, duration, track, null, [from.concat(0),to.concat(1,easing)], null, local);
        }
        else {
            this.animateObject(time, duration, track, null, [from.concat(0),to.concat(1)], null, local);
        }  
    },

    scaleObject: function(time, duration, track, from, to, easing) {
        if(easing) {
            this.animateObject(time, duration, track, null, null, [from.concat(0),to.concat(1,easing)]);
        }
        else {
            this.animateObject(time, duration, track, null, null, [from.concat(0),to.concat(1)]);
        }
    },

    moveAndRotateObject: function(time, duration, track, from, to, fromR, toR, easing) {
        if(easing) {
            this.animateObject(time, duration, track, [from.concat(0),to.concat(1)], [fromR.concat(0),toR.concat(1)]);
        }
        else {
            this.animateObject(time, duration, track, [from.concat(0),to.concat(1)], [fromR.concat(0),toR.concat(1)]);
        }
    },

    moveGeomtetryGroup: function(time, duration, group, from, to, easing) {
        var currentAvgPos = getAvgPosition(group);
        for(var i = 0; i < group.length; i++) {
            var pFrom = [group[i].position[0] - currentAvgPos[0] + from[0], group[i].position[1] - currentAvgPos[1] + from[1], group[i].position[2] - currentAvgPos[2] + from[2]];
            var pTo = [group[i].position[0] - currentAvgPos[0] + to[0], group[i].position[1] - currentAvgPos[1] + to[1], group[i].position[2] - currentAvgPos[2] + to[2]];
            this.moveObject(time+0.0001*i, duration, group[i].track, pFrom, pTo, easing);
        }
    },

    moveGeomtetryGroupOS: function(time, duration, group, from, to, easing) {
        for(var i = 0; i < group.length; i++) {
            var pFrom = [group[i].position[0] + from[0], group[i].position[1] + from[1], group[i].position[2] + from[2]];
            var pTo = [group[i].position[0] + to[0], group[i].position[1] + to[1], group[i].position[2] + to[2]];
            if(easing) {
                this.moveObject(time+0.0002*i, duration, group[i].track, pFrom, pTo, easing);
            }
            else {
                this.animateObject(time+0.0002*i, duration, group[i].track, [
                    pFrom.concat(0), 
                    pTo.concat(0.999),
                    [group[i].position[0], group[i].position[1], group[i].position[2],1]
                ]);
            }
        }
    },

    //hacer v3
    compressFloats: function(noTime) {
        var tk = noTime?3:4;
        for(var i = 0; i < _customEvents.length; i++) {
            if(_customEvents[i]._type == "AnimateTrack") {
                if(_customEvents[i]._data._position) {
                    for(var j = 0; j < _customEvents[i]._data._position.length; j++) {
                        for(var k = 0; k < tk; k++) {
                            _customEvents[i]._data._position[j][k] = Math.round(_customEvents[i]._data._position[j][k]*100)/100;
                        }
                    }
                }
                if(_customEvents[i]._data._rotation) {
                    for(var j = 0; j < _customEvents[i]._data._rotation.length; j++) {
                        for(var k = 0; k < tk; k++) {
                            _customEvents[i]._data._rotation[j][k] = Math.round(_customEvents[i]._data._rotation[j][k]*100)/100;
                        }
                    }
                }
                if(_customEvents[i]._data._scale) {
                    for(var j = 0; j < _customEvents[i]._data._scale.length; j++) {
                        for(var k = 0; k < tk; k++) {
                            _customEvents[i]._data._scale[j][k] = Math.round(_customEvents[i]._data._scale[j][k]*100)/100;
                        }
                    }
                }
                if(_customEvents[i]._data._localPosition) {
                    for(var j = 0; j < _customEvents[i]._data._localPosition.length; j++) {
                        for(var k = 0; k < tk; k++) {
                            _customEvents[i]._data._localPosition[j][k] = Math.round(_customEvents[i]._data._localPosition[j][k]*100)/100;
                        }
                    }
                }
                if(_customEvents[i]._data._localRotation) {
                    for(var j = 0; j < _customEvents[i]._data._localRotation.length; j++) {
                        for(var k = 0; k < tk; k++) {
                            _customEvents[i]._data._localRotation[j][k] = Math.round(_customEvents[i]._data._localRotation[j][k]*100)/100;
                        }
                    }
                }
            }
        }
        for(var i = 0; i < _events.length; i++) {
            _events[i]._time = Math.round(_events[i]._time*100)/100;
            if(_events[i]._customData) {
                if(_events[i]._customData._color) {
                    for(var j = 0; j < _events[i]._customData._color.length; j++) {
                        _events[i]._customData._color[j] = Math.round(_events[i]._customData._color[j]*100)/100;
                    }
                }
            }
        }
    },

    getGeometryStartData: function(track) {
        for(var i = 0; i < _environment.length; i++) {
            if(_environment[i].track && _environment[i].track == track) {
                return _environment[i];
            }
        }
    },

    getGeoDataAndParent: function(trackPrefix, parentTrack) {
        let objects = this.getGeometryGroupStartData(trackPrefix);
        this.assingTrackParentObjects(-1, objects, parentTrack, true);
        return objects;
    },

    getGeometryGroupStartData: function(trackPrefix, type) {
        var objects = [];
        for(var i = 0; i < _environment.length; i++) {
            if(_environment[i].track && _environment[i].track.startsWith(trackPrefix)) {
                if(_environment[i].geometry && type) {
                    if(_environment[i].geometry.type == type) {
                        objects.push(_environment[i]);
                    }
                }
                else {
                    objects.push(_environment[i]);
                }
            }
        }
        return objects;
    },

    numloop: function(valor, min, max) {
        if (valor >= min && valor <= max) {
          return valor;
        }
        let diferencia = valor - min;
        let tamaño = max - min + 1;
        let resto = diferencia % tamaño;
        let resultado = min + resto;
        return resultado;
    },

    trackMaterial: function(matName, track) {
        if (matName in materials) {
            materials[matName].track = track;
        }
    },

    setShaderKeywords: function(matName, shaderKeywords) {
        if (matName in materials) {
            materials[matName].shaderKeywords = shaderKeywords;
        }
    },

    instantWallColorChange,
    fixStartingLights,
    getAvgPosition,
    applyCustomDataToNotes,
    applyCustomDataToBombs,
    applyCustomDataToObstacles
    
};

function getAvgPosition(group) {
    var xsum = 0;
    var ysum = 0;
    var zsum = 0;
    for(var i = 0; i < group.length; i++) {
        xsum += group[i].position[0];
        ysum += group[i].position[1];
        zsum += group[i].position[2];
    }
    return [xsum/group.length, ysum/group.length, zsum/group.length];
}

function fixStartingLights() {
    for(var i = 0; i < 5; i++) {
        lightEvent(0, i, 1, [0,0,0,0]);
        lightEvent(0.0001, i, 0);
    }
}

function instantWallColorChange(time, color) {
    if(v3) {
        _customEvents.push(
            {
                "b": time,
                "t": "AnimateTrack",
                "d": {
                    "track": "w",
                    "duration": 0,
                    "color": color
                }
            }
        )
    }
    else {
        _customEvents.push(
            {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "w",
                    "_duration": 0,
                    "_color": color
                }
            }
        )
    }
};

function applyChromaToFile(fileName, keepEvents) {
    //leemos el archivo dentro de output
    let difficulty;
    try {
        difficulty = JSON.parse(fs.readFileSync(fileName));
    } catch (error) {
        console.error("Warning: the file " + fileName + " was not found.")
        return;
    }
  
    //Aplicamos los valores
    if(v3) {
        //difficulty.customData = { environment: [], customEvents: [] , materials: {}};
        if(keepEvents) {
            for(var i = 0; i < difficulty.basicBeatmapEvents.length; i++) {
                _events.push(difficulty.basicBeatmapEvents[i]);
            }
        }
        difficulty.basicBeatmapEvents = _events;
        difficulty.customData.environment = [];
        difficulty.customData.customEvents = [];
        difficulty.customData.fakeColorNotes = [];
        //if(_pointDefinitions.length != 0) {
        //    difficulty.customData.pointDefinitions = []; //TODO TERMINAR DE HACER COMPATIBILIDAD V3
        //}
        difficulty.customData.materials = {};
      
        difficulty.customData.environment = _environment;
        difficulty.customData.customEvents = _customEvents;
        difficulty.customData.fakeColorNotes = fakeColorNotes;
        //difficulty.customData.pointDefinitions = _pointDefinitions;
        difficulty.customData.materials = materials;
    
        //Aplicamos la version 3.2.0 (ChroMapper debug)
        difficulty.version = "3.2.0";
    }
    else {
        difficulty._events = _events;
        //difficulty._customData = { _environment: [], _customEvents: [], _materials: {}};
        difficulty._customData._environment = [];
        difficulty._customData._customEvents = [];
        if(_pointDefinitions.length != 0) {
            difficulty._customData._pointDefinitions = [];
        }
        difficulty._customData._materials = {};
      
        difficulty._customData._environment = _environment;
        difficulty._customData._customEvents = _customEvents;
        difficulty._customData._pointDefinitions = _pointDefinitions;
        difficulty._customData._materials = materials;
        
    
        //Aplicamos la version 2.2.0 (ChroMapper debug)
        difficulty._version = "2.2.0";
    }

    //Escribimos al archivo dentro de la nueva carpeta
    fs.writeFileSync(fileName, JSON.stringify(difficulty, null, 0));
    console.log("Chroma events applied to " + fileName);
}

function applyForcedNoteColorsToFile(fileName, leftColor, rightColor, timed, fromBeat, toBeat) {
    //leemos el archivo dentro de output
    let difficulty = JSON.parse(fs.readFileSync(fileName));
  
    //Aplicamos los valores
    if(v3) {
        for(var i = 0; i < difficulty.colorNotes.length; i++) {
            if(timed) {
                if(difficulty.colorNotes[i].b < fromBeat || difficulty.colorNotes[i].b > toBeat) {
                    continue;
                }
            }
            difficulty.colorNotes[i].customData = {};
            if(difficulty.colorNotes[i].c == 0) {
                difficulty.colorNotes[i].customData.color = leftColor;
            }
            else {
                difficulty.colorNotes[i].customData.color = rightColor;
            }
        }
        for(var i = 0; i < difficulty.sliders.length; i++) {
            if(timed) {
                if(difficulty.sliders[i].b < fromBeat || difficulty.sliders[i].b > toBeat) {
                    continue;
                }
            }
            difficulty.sliders[i].customData = {};
            if(difficulty.sliders[i].c == 0) {
                difficulty.sliders[i].customData.color = leftColor;
            }
            else {
                difficulty.sliders[i].customData.color = rightColor;
            }
        }
        for(var i = 0; i < difficulty.burstSliders.length; i++) {
            if(timed) {
                if(difficulty.burstSliders[i].b < fromBeat || difficulty.burstSliders[i].b > toBeat) {
                    continue;
                }
            }
            difficulty.burstSliders[i].customData = {};
            if(difficulty.burstSliders[i].c == 0) {
                difficulty.burstSliders[i].customData.color = leftColor;
            }
            else {
                difficulty.burstSliders[i].customData.color = rightColor;
            }
        }
    }
    else {
        for(var i = 0; i < difficulty._notes.length; i++) {
            if(timed) {
                if(difficulty._notes[i]._time < fromBeat || difficulty._notes[i]._time > toBeat) {
                    continue;
                }
            }
            difficulty._notes[i]._customData = {};
            if(difficulty._notes[i]._type == 0) {
                difficulty._notes[i]._customData._color = leftColor;
            }
            else {
                difficulty._notes[i]._customData._color = rightColor;
            }
        }
    }

    //Escribimos al archivo dentro de la nueva carpeta
    fs.writeFileSync(fileName, JSON.stringify(difficulty, null, 0));
}

function applyForcedObstacleColorToFile(fileName, obstacleColor) {
    //leemos el archivo dentro de output
    let difficulty = JSON.parse(fs.readFileSync(fileName));
  
    //Aplicamos los valores
    if(v3) {
        for(var i = 0; i < difficulty.obstacles.length; i++) {
            difficulty.obstacles[i].customData = {};
            difficulty.obstacles[i].customData.color = obstacleColor;
        }
    }
    else {
        for(var i = 0; i < difficulty._obstacles.length; i++) {
            difficulty._obstacles[i]._customData = {};
            difficulty._obstacles[i]._customData._color = obstacleColor;
        }
    }

    //Escribimos al archivo dentro de la nueva carpeta
    fs.writeFileSync(fileName, JSON.stringify(difficulty, null, 0));
}

function applyCustomDataToNotes(from, to, customData, filter) {
    difficulties.forEach(d => applyCustomDataToNotesFile(path.join(folder, d), from, to, customData, filter));
}

//filter 0 = all, 1 = red, 2 = blue
function applyCustomDataToNotesFile(fileName, from, to, customData, filter) {
    //leemos el archivo dentro de output
    let difficulty = JSON.parse(fs.readFileSync(fileName));
  
    //Aplicamos los valores
    for(var i = 0; i < difficulty.colorNotes.length; i++) {
        if(difficulty.colorNotes[i].b >= from && difficulty.colorNotes[i].b <= to) {
            if(filter) {
                if(filter == 1) {
                    if(difficulty.colorNotes[i].c) {
                        if(difficulty.colorNotes[i].c != 1) {
                            difficulty.colorNotes[i].customData = customData;
                        }
                    }
                    else {
                        difficulty.colorNotes[i].customData = customData;
                    }
                }
                else if(filter == 2) {
                    if(difficulty.colorNotes[i].c) {
                        if(difficulty.colorNotes[i].c == 1) {
                            difficulty.colorNotes[i].customData = customData;
                        }
                    }
                }
                else {
                    difficulty.colorNotes[i].customData = customData;
                }
            }
            else {
                difficulty.colorNotes[i].customData = customData;
            }
            
        }
    }
    //Escribimos al archivo dentro de la nueva carpeta
    fs.writeFileSync(fileName, JSON.stringify(difficulty, null, 0));
}

function applyCustomDataToBombs(from, to, customData) {
    difficulties.forEach(d => applyCustomDataToBombsFile(path.join(folder, d), from, to, customData));
}

function applyCustomDataToBombsFile(fileName, from, to, customData) {
    //leemos el archivo dentro de output
    let difficulty = JSON.parse(fs.readFileSync(fileName));
  
    //Aplicamos los valores
    for(var i = 0; i < difficulty.bombNotes.length; i++) {
        if(difficulty.bombNotes[i].b >= from && difficulty.bombNotes[i].b <= to) {
            difficulty.bombNotes[i].customData = customData;
        }
    }
    //Escribimos al archivo dentro de la nueva carpeta
    fs.writeFileSync(fileName, JSON.stringify(difficulty, null, 0));
}

function applyCustomDataToObstacles(from, to, customData) {
    difficulties.forEach(d => applyCustomDataToObstaclesFile(path.join(folder, d), from, to, customData));
}

function applyCustomDataToObstaclesFile(fileName, from, to, customData) {
    //leemos el archivo dentro de output
    let difficulty = JSON.parse(fs.readFileSync(fileName));
  
    //Aplicamos los valores
    for(var i = 0; i < difficulty.obstacles.length; i++) {
        if(difficulty.obstacles[i].b >= from && difficulty.obstacles[i].b <= to) {
            difficulty.obstacles[i].customData = customData;
        }
    }
    //Escribimos al archivo dentro de la nueva carpeta
    fs.writeFileSync(fileName, JSON.stringify(difficulty, null, 0));
}

function prepareFileForWallGradients(fileName) {
    //leemos el archivo dentro de output
    let difficulty = JSON.parse(fs.readFileSync(fileName));
  
    //Aplicamos los valores
    if(v3) {
        for(var i = 0; i < difficulty.obstacles.length; i++) {
            difficulty.obstacles[i].customData = {};
            difficulty.obstacles[i].customData.track = "w";
        }
    }
    else {
        for(var i = 0; i < difficulty._obstacles.length; i++) {
            difficulty._obstacles[i]._customData = {};
            difficulty._obstacles[i]._customData._track = "w";
        }
    }
    
    //Escribimos al archivo dentro de la nueva carpeta
    fs.writeFileSync(fileName, JSON.stringify(difficulty, null, 0));
}

/*unused*/
function applyObstacleColorToFile(fileName, from, to, obstacleColor) {
    //leemos el archivo dentro de output
    let difficulty = JSON.parse(fs.readFileSync(fileName));
  
    //Aplicamos los valores
    for(var i = 0; i < difficulty._obstacles.length; i++) {
        if(difficulty._obstacles[i]._time >= from && difficulty._obstacles[i]._time < to) {
            difficulty._obstacles[i]._customData = {};
            difficulty._obstacles[i]._customData._color = obstacleColor;
        }
    }

    //Escribimos al archivo dentro de la nueva carpeta
    fs.writeFileSync(fileName, JSON.stringify(difficulty, null, 0));
}

function copyFile(fileName) {
    const FROM = path.join(baseDir, fileName);
    if (!fs.existsSync(FROM)){
        return;
    }
    const COPY = path.join(folder, fileName);
    fs.copyFileSync(FROM, COPY);
}

function lightEvent(time, type, value, color, id) {
    if(v3) {
        const event = {};
        event.b = time;
        event.et = type;
        event.i = value;
        event.f = 1;
        if(color || id) {
            event.customData = {};
        }
        if(color) {
            event.customData.color = color;
        }
        if(id) {
            event.customData.lightID = id;
        }
        _events.push(event);
    }
    else {
        const event = {};
        event._time = time;
        event._type = type;
        event._value = value;
        if(color || id) {
            event._customData = {};
        }
        if(color) {
            event._customData._color = color;
        }
        if(id) {
            event._customData._lightID = id;
        }
        _events.push(event);
    }
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
      Math.round(r * 100) / 100, 
      Math.round(g * 100) / 100, 
      Math.round(b * 100) / 100
    ];
  }
  
  function RGBtoHSV (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r;
    gabs = g;
    babs = b;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);
  
        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

function easeOutCubic(start, end, value) {
    value--;
    end -= start;
    return end * (value * value * value + 1) + start;
}

function GeometryObject(track, position, rotation, scale) {
    this.track = track;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
}