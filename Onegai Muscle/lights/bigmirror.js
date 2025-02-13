const chroma = require("./chroma");

const ringsZ = 26;
const ringSep = 13.35;
let ringsOffset = Array(15).fill(ringsZ);

const ringHalfA = [1,2,5,6,9,10,13,14,17,18,21,22,25,26,29,30,33,34,37,38,41,42,45,46,49,50,53,54,57,58];
const ringHalfB = [3,4,7,8,11,12,15,16,19,20,23,24,27,28,31,32,35,36,39,40,43,44,47,48,51,52,55,56,59,60];

const ringSideA = [2,6,10,14,18,22,26,30,34,38,42,46,50,54,58];
const ringSideB = [3,7,11,15,19,23,27,31,35,39,43,47,51,55,59];
const ringSideC = [1,5,9,13,17,21,25,29,33,37,41,45,49,53,57];
const ringSideD = [4,8,12,16,20,24,28,32,36,40,44,48,52,56,60];

const rotationLights = [800,801,802,803,1,2,3,4,804,805,806,807];

const baseRingsOffset = Array(15);

module.exports = {

    environmentName: "BigMirrorEnvironment",

    ringHalfA, ringHalfB,
    ringSideA, ringSideB, ringSideC, ringSideD,

    rotationLights,

    baseRingsOffset,

    TOP: 0,
    RINGS: 1,
    LEFT: 2,
    RIGHT: 3,
    BACK: 4,

    clearEnvironment: function () {
        chroma.disableEnvironmentObject("Environment.[11]Spectrograms", "EndsWith");
        chroma.disableEnvironmentObject("NearBuildingLeft", "EndsWith");
        chroma.disableEnvironmentObject("NearBuildingRight", "EndsWith");
        chroma.disableEnvironmentObject("BottomBoxLight", "EndsWith");
        chroma.disableEnvironmentObject("BottomBakedBloom", "EndsWith");
        chroma.disableEnvironmentObject("NeonTubeDirectionalL", "EndsWith");
        chroma.disableEnvironmentObject("NeonTubeDirectionalR", "EndsWith");
        chroma.scaleEnvironmentObject("Environment.[3]Floor", "EndsWith", [0.3, 1, 1]);
    },

    envSetup1: function() {
        var tlox = 70;
        var tloy = -500;
        var tlozSta = 60;
        var tlozSep = 15;
        chroma.positionEnvironmentObject("[20]DoubleColorLaser", "EndsWith", [tlox,tloy,tlozSta+4*tlozSep]);
        chroma.positionEnvironmentObject("[22]DoubleColorLaser (1)", "EndsWith", [-tlox,tloy,tlozSta+4*tlozSep]);
        chroma.positionEnvironmentObject("[23]DoubleColorLaser (2)", "EndsWith", [tlox,tloy,tlozSta+3*tlozSep]);
        chroma.positionEnvironmentObject("[24]DoubleColorLaser (3)", "EndsWith", [-tlox,tloy,tlozSta+3*tlozSep]);
        chroma.positionEnvironmentObject("[21]DoubleColorLaser (4)", "EndsWith", [tlox,tloy,tlozSta+2*tlozSep]);
        chroma.positionEnvironmentObject("[25]DoubleColorLaser (5)", "EndsWith", [-tlox,tloy,tlozSta+2*tlozSep]);
        chroma.positionEnvironmentObject("[26]DoubleColorLaser (6)", "EndsWith", [tlox,tloy,tlozSta+tlozSep]);
        chroma.positionEnvironmentObject("[28]DoubleColorLaser (7)", "EndsWith", [-tlox,tloy,tlozSta+tlozSep]);
        chroma.positionEnvironmentObject("[27]DoubleColorLaser (8)", "EndsWith", [tlox,tloy,tlozSta]);
        chroma.positionEnvironmentObject("[29]DoubleColorLaser (9)", "EndsWith", [-tlox,tloy,tlozSta]);

        var backScale = [5,20,50000];
        chroma.scaleEnvironmentObject("[20]DoubleColorLaser", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[22]DoubleColorLaser (1)", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[23]DoubleColorLaser (2)", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[24]DoubleColorLaser (3)", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[21]DoubleColorLaser (4)", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[25]DoubleColorLaser (5)", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[26]DoubleColorLaser (6)", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[28]DoubleColorLaser (7)", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[27]DoubleColorLaser (8)", "EndsWith", backScale);
        chroma.scaleEnvironmentObject("[29]DoubleColorLaser (9)", "EndsWith", backScale);

        var backRotation = [0,8,0];
        var backRotation2 = [0,-8,0];
        chroma.rotateEnvironmentObject("[20]DoubleColorLaser", "EndsWith", backRotation2);
        chroma.rotateEnvironmentObject("[22]DoubleColorLaser (1)", "EndsWith", backRotation);
        chroma.rotateEnvironmentObject("[23]DoubleColorLaser (2)", "EndsWith", backRotation2);
        chroma.rotateEnvironmentObject("[24]DoubleColorLaser (3)", "EndsWith", backRotation);
        chroma.rotateEnvironmentObject("[21]DoubleColorLaser (4)", "EndsWith", backRotation2);
        chroma.rotateEnvironmentObject("[25]DoubleColorLaser (5)", "EndsWith", backRotation);
        chroma.rotateEnvironmentObject("[26]DoubleColorLaser (6)", "EndsWith", backRotation2);
        chroma.rotateEnvironmentObject("[28]DoubleColorLaser (7)", "EndsWith", backRotation);
        chroma.rotateEnvironmentObject("[27]DoubleColorLaser (8)", "EndsWith", backRotation2);
        chroma.rotateEnvironmentObject("[29]DoubleColorLaser (9)", "EndsWith", backRotation);
    },

    setupRings: function() {
        const boxLightScale = [3,500,3];
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (1)", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (2)", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (3)", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("BigTrackLaneRing(Clone)", "EndsWith", [0.4,0.4,0.4]);
        for(var i = 1; i <= 15; i++) {
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone)", "EndsWith", "r"+i);
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[1]NeonTubeBothSidesDirectional", "EndsWith", "r"+i+"a");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[2]NeonTubeBothSidesDirectional (1)", "EndsWith", "r"+i+"b");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[3]NeonTubeBothSidesDirectional (2)", "EndsWith", "r"+i+"c");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[4]NeonTubeBothSidesDirectional (3)", "EndsWith", "r"+i+"d");
        }
        for(var i = 15; i >= 1; i--) {
            baseRingsOffset[i-1] = -ringSep*(i-1);
        }
    },

    setupRings2: function() {
        const boxLightScale = [5,7.8,5];
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (1)", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (2)", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (3)", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("BigTrackLaneRing(Clone)", "EndsWith", [0.4,0.4,0.4]);
        for(var i = 1; i <= 15; i++) {
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone)", "EndsWith", "r"+i);
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[1]NeonTubeBothSidesDirectional", "EndsWith", "r"+i+"a");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[2]NeonTubeBothSidesDirectional (1)", "EndsWith", "r"+i+"b");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[3]NeonTubeBothSidesDirectional (2)", "EndsWith", "r"+i+"c");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[4]NeonTubeBothSidesDirectional (3)", "EndsWith", "r"+i+"d");
        }

        chroma.trackEnvironmentObject("[0]Ring", "EndsWith", "rs");
        for(var i = 15; i >= 1; i--) {
            baseRingsOffset[i-1] = -ringSep*(i-1);
        }
    },

    setupRings3: function() {
        const boxLightScale = [1,1,30];
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (1)", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (2)", "EndsWith", boxLightScale);
        chroma.scaleEnvironmentObject("NeonTubeBothSidesDirectional (3)", "EndsWith", boxLightScale);
        //chroma.scaleEnvironmentObject("BigTrackLaneRing(Clone)", "EndsWith", [0.3,0.3,0.3]);
        chroma.positionEnvironmentObject("BigTrackLaneRing(Clone)", "EndsWith", [0,0,0]);
        for(var i = 1; i <= 15; i++) {
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone)", "EndsWith", "r"+i);
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[1]NeonTubeBothSidesDirectional", "EndsWith", "r"+i+"a");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[2]NeonTubeBothSidesDirectional (1)", "EndsWith", "r"+i+"b");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[3]NeonTubeBothSidesDirectional (2)", "EndsWith", "r"+i+"c");
            chroma.trackEnvironmentObject("["+i+"]BigTrackLaneRing(Clone).[4]NeonTubeBothSidesDirectional (3)", "EndsWith", "r"+i+"d");
        }

        chroma.trackEnvironmentObject("[0]Ring", "EndsWith", "rs");
        for(var i = 15; i >= 1; i--) {
            baseRingsOffset[i-1] = -ringSep*(i-1);
        }
    },

    setupRotatingLights: function(v3) {
        for(var i = 0; i < 8; i++) {
            if(v3){
                chroma._environment.push(
                    {
                        "id": "RotatingLasersPair",
                        "lookupMethod": "EndsWith",
                        "duplicate": 1,
                        "position": [0,0,0.6*(((i<4)?25:60)+8*i)],
                        "components": {
                            "ILightWithId": {
                                "lightID": 800+i
                            }
                        }
                    }
                )
            }
            else{
                chroma._environment.push(
                    {
                        "_id": "RotatingLasersPair",
                        "_lookupMethod": "EndsWith",
                        "_duplicate": 1,
                        "_lightID": 800+i,
                        "_position": [0,0,((i<4)?25:60)+8*i],
                    }
                )
            }
            
        }
    },

    lightOn: function (type, time) {
        chroma.pushLightEvent(time, type, 1);
    }, 

    lightOff: function (type, time) {
        chroma.pushLightEvent(time, type, 0);
    },

    lightRings: function(time, duration, color) {
        chroma.pushLightEvent(time, this.RINGS, 1, color);
        chroma.pushLightEvent(time+duration, this.RINGS, 0);
    },

    lightRing: function(time, duration, color, index) {
        chroma.pushLightEvent(time, this.RINGS, 1, color, [ringSideA[index],ringSideB[index],ringSideC[index],ringSideD[index]]);
        chroma.pushLightEvent(time+duration, this.RINGS, 0, null, [ringSideA[index],ringSideB[index],ringSideC[index],ringSideD[index]]);
    },

    fadeRingSingle: function(time, duration, color, index) {
        chroma.pushLightStepGradientEvent(time, this.RINGS, [ringSideA[index],ringSideB[index],ringSideC[index],ringSideD[index]], duration, color, [0,0,1,0], 16);
    },

    fadeRing: function(time, color, index) {
        chroma.pushFadeEvent(time, this.RINGS, color, [ringSideA[index],ringSideB[index],ringSideC[index],ringSideD[index]]);
    },

    lightOnColor: function (type, time, color) {
        chroma.pushLightEvent(time, type, 1, color);
    }, 

    lightOnIdColor: function (type, time, color, id) {
        chroma.pushLightEvent(time, type, 1, color, id);
    }, 

    lightOffId: function (type, time, id) {
        chroma.pushLightEvent(time, type, 0, null, id);
    },

    ringsZoom: function (time, from, to, duration, fromZ, toZ) {
        customRingsZoom(time, from, to, duration, fromZ, toZ);
    },

    ringsZoomReset: function (time, duration) {
        customRingsZoom(time, 0, duration);
    },

    pianoFade: function (time, type, period, color, lightIds, melody) {
        for(var i = 0; i < melody.length; i++) {
            chroma.pushFadeEvent(time + i*period, type, color, lightIds[melody[i]]);
        }
    },

    fadeRandomLaser: function(time, color) {
        if(Math.random() > 0.5) {
            chroma.pushFadeEvent(time, this.LEFT, color, rotationLights[Math.floor(rotationLights.length*Math.random())]);
        }
        else {
            chroma.pushFadeEvent(time, this.RIGHT, color, rotationLights[Math.floor(rotationLights.length*Math.random())]);
        }
    },

    manualStrobeFade: function (type, color, timePoints) {
        for(var i = 0; i < timePoints.length; i++) {
            chroma.pushFadeEvent(timePoints[i], type, color);
        }
    },

    manualStrobeGradient: function (type, duration, startColor, endColor, timePoints, offSet) {
        for(var i = 0; i < timePoints.length; i++) {
            t = timePoints[i];
            if(offSet) {
                t = t+offSet;
            }
            chroma.pushLightGradientEvent(t, type, duration, startColor, endColor, "easeOutSine");
        }
    },

    fadeFloorLines: function(time, color) {
        chroma.pushFadeEvent(time, 2, color, 5);
        chroma.pushFadeEvent(time, 3, color, 5);
    },

    fadeFarLights: function(time, color) {
        chroma.pushFadeEvent(time, 0, color);
    },

    //doesn't work while zoom
    ringsKick: function(time) {
        for(var i = 15; i >= 1; i--) {
            chroma._customEvents.push(
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i,
                    "_duration": 0.3,
                    "_scale": [
                        [1, 1, 1, 0],
                        [1.15, 1.15, 1.15, 0.5, "easeInOutSine"],
                        [1, 1, 1, 1]
                    ]
                }
              }
            )
          }
    },

    //should work while zoom
    ringsKick2: function(time, force, scale) {
        var boxLightScale = [5,7.8,5];
        if(scale) {
            boxLightScale = [12,7.8,12];
        }
        for(var i = 15; i >= 1; i--) {
            chroma._customEvents.push(
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"a",
                    "_duration": 0.3,
                    "_localPosition": [
                        [38.5, 0, 0, 0],
                        [38.5+2.2*force, 0, 0, 0.5, "easeInOutSine"],
                        [38.5, 0, 0, 1]
                    ],
                    "_scale": [
                        boxLightScale.concat(0),
                        [boxLightScale[0]*(1 + Math.log10(force)/2.5), boxLightScale[1]*(1 + Math.log10(force)/2.5), boxLightScale[2]*(1 + Math.log10(force)/2.5), 0.5, "easeInOutSine"],
                        boxLightScale.concat(1),
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"b",
                    "_duration": 0.3,
                    "_localPosition": [
                        [-38.5, 0, 0, 0],
                        [-38.5-2.2*force, 0, 0, 0.5, "easeInOutSine"],
                        [-38.5, 0, 0, 1]
                    ],
                    "_scale": [
                        boxLightScale.concat(0),
                        [boxLightScale[0]*(1 + Math.log10(force)/2.5), boxLightScale[1]*(1 + Math.log10(force)/2.5), boxLightScale[2]*(1 + Math.log10(force)/2.5), 0.5, "easeInOutSine"],
                        boxLightScale.concat(1),
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"c",
                    "_duration": 0.3,
                    "_localPosition": [
                        [0, -38.5, 0, 0],
                        [0, -38.5-2.2*force, 0, 0.5, "easeInOutSine"],
                        [0, -38.5, 0, 1]
                    ],
                    "_scale": [
                        boxLightScale.concat(0),
                        [boxLightScale[0]*(1 + Math.log10(force)/2.5), boxLightScale[1]*(1 + Math.log10(force)/2.5), boxLightScale[2]*(1 + Math.log10(force)/2.5), 0.5, "easeInOutSine"],
                        boxLightScale.concat(1),
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"d",
                    "_duration": 0.3,
                    "_localPosition": [
                        [0, 38.5, 0, 0],
                        [0, 38.5+2.2*force, 0, 0.5, "easeInOutSine"],
                        [0, 38.5, 0, 1]
                    ],
                    "_scale": [
                        boxLightScale.concat(0),
                        [boxLightScale[0]*(1 + Math.log10(force)/2.5), boxLightScale[1]*(1 + Math.log10(force)/2.5), boxLightScale[2]*(1 + Math.log10(force)/2.5), 0.5, "easeInOutSine"],
                        boxLightScale.concat(1),
                    ]
                }
              }
            )
          }
    },

    ringsBrokenKick: function(time, force, duration) {
        const boxLightScaleE = [12,7.8,12];
        const boxLightScale = [5,7.8,5];
        for(var i = 15; i >= 1; i--) {
            chroma._customEvents.push(
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"a",
                    "_duration": duration,
                    "_localPosition": [
                        [38.5, 0, 0, 0],
                        [38.5+2.2*force+5*Math.random(), (20*Math.random()-10), (20*Math.random()-10), 0.999, "easeOutCubic"],
                        [38.5, 0, 0, 1]
                    ],
                    "_scale": [
                        boxLightScaleE.concat(0),
                        [boxLightScaleE[0], boxLightScaleE[1]*0.8, boxLightScaleE[2], 0.999, "easeOutCubic"],
                        boxLightScale.concat(1),
                    ],
                    "_localRotation": [
                        [0, 0, 0, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), (90*Math.random()-45), 0.999, "easeOutCubic"],
                        [0, 0, 0, 1]
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"b",
                    "_duration": duration,
                    "_localPosition": [
                        [-38.5, 0, 0, 0],
                        [-38.5-2.2*force-5*Math.random(), (20*Math.random()-10), (20*Math.random()-10), 0.999, "easeOutCubic"],
                        [-38.5, 0, 0, 1]
                    ],
                    "_scale": [
                        boxLightScaleE.concat(0),
                        [boxLightScaleE[0], boxLightScaleE[1]*0.8, boxLightScaleE[2], 0.999, "easeOutCubic"],
                        boxLightScale.concat(1),
                    ],
                    "_localRotation": [
                        [0, 0, 0, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), (90*Math.random()-45), 0.999, "easeOutCubic"],
                        [0, 0, 0, 1]
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"c",
                    "_duration": duration,
                    "_localPosition": [
                        [0, -38.5, 0, 0],
                        [(20*Math.random()-10), -38.5-2.2*force-5*Math.random(), (20*Math.random()-10), 0.999, "easeOutCubic"],
                        [0, -38.5, 0, 1]
                    ],
                    "_scale": [
                        boxLightScaleE.concat(0),
                        [boxLightScaleE[0], boxLightScaleE[1]*0.8, boxLightScaleE[2], 0.999, "easeOutCubic"],
                        boxLightScale.concat(1),
                    ],
                    "_localRotation": [
                        [0, 0, 90, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), 90+(90*Math.random()-45), 0.999, "easeOutCubic"],
                        [0, 0, 90, 1]
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"d",
                    "_duration": duration,
                    "_localPosition": [
                        [0, 38.5, 0, 0],
                        [(20*Math.random()-10), 38.5+2.2*force+5*Math.random(), (20*Math.random()-10), 0.999, "easeOutCubic"],
                        [0, 38.5, 0, 1]
                    ],
                    "_scale": [
                        boxLightScaleE.concat(0),
                        [boxLightScaleE[0], boxLightScaleE[1]*0.8, boxLightScaleE[2], 0.999, "easeOutCubic"],
                        boxLightScale.concat(1),
                    ],
                    "_localRotation": [
                        [0, 0, -90, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), -90+(90*Math.random()-45), 0.999, "easeOutCubic"],
                        [0, 0, -90, 1]
                    ]
                }
              }
            )
          }
    },

    fallingStarsKick: function(time, force, duration) {
        const SboxLightScale = [8,0.4,8];
        const boxLightScale = [5,7.8,5];
        for(var i = 15; i >= 1; i--) {
            chroma._customEvents.push(
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"a",
                    "_duration": duration,
                    "_localPosition": [
                        [38.5, 0, 0, 0],
                        [38.5+2.2*force+5*Math.random(), (20*Math.random()-10), (20*Math.random()-10), 0.999, "easeOutCubic"],
                        [38.5, 0, 0, 1]
                    ],
                    "_scale": [
                        SboxLightScale.concat(0),
                        [SboxLightScale[0], SboxLightScale[1]*0.8, SboxLightScale[2], 0.999, "easeOutCubic"],
                        boxLightScale.concat(1),
                    ],
                    "_localRotation": [
                        [0, 0, 0, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), (90*Math.random()-45), 0.999, "easeOutCubic"],
                        [0, 0, 0, 1]
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"b",
                    "_duration": duration,
                    "_localPosition": [
                        [-38.5, 0, 0, 0],
                        [-38.5-2.2*force-5*Math.random(), (20*Math.random()-10), (20*Math.random()-10), 0.999, "easeOutCubic"],
                        [-38.5, 0, 0, 1]
                    ],
                    "_scale": [
                        SboxLightScale.concat(0),
                        [SboxLightScale[0], SboxLightScale[1]*0.8, SboxLightScale[2], 0.999, "easeOutCubic"],
                        boxLightScale.concat(1),
                    ],
                    "_localRotation": [
                        [0, 0, 0, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), (90*Math.random()-45), 0.999, "easeOutCubic"],
                        [0, 0, 0, 1]
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"c",
                    "_duration": duration,
                    "_localPosition": [
                        [0, -38.5, 0, 0],
                        [(20*Math.random()-10), -38.5-2.2*force-5*Math.random(), (20*Math.random()-10), 0.999, "easeOutCubic"],
                        [0, -38.5, 0, 1]
                    ],
                    "_scale": [
                        SboxLightScale.concat(0),
                        [SboxLightScale[0], SboxLightScale[1]*0.8, SboxLightScale[2], 0.999, "easeOutCubic"],
                        boxLightScale.concat(1),
                    ],
                    "_localRotation": [
                        [0, 0, 90, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), 90+(90*Math.random()-45), 0.999, "easeOutCubic"],
                        [0, 0, 90, 1]
                    ]
                }
              },
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "r"+i+"d",
                    "_duration": duration,
                    "_localPosition": [
                        [0, 38.5, 0, 0],
                        [(20*Math.random()-10), 38.5+2.2*force+5*Math.random(), (20*Math.random()-10), 0.999, "easeOutCubic"],
                        [0, 38.5, 0, 1]
                    ],
                    "_scale": [
                        SboxLightScale.concat(0),
                        [SboxLightScale[0], SboxLightScale[1]*0.8, SboxLightScale[2], 0.999, "easeOutCubic"],
                        boxLightScale.concat(1),
                    ],
                    "_localRotation": [
                        [0, 0, -90, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), -90+(90*Math.random()-45), 0.999, "easeOutCubic"],
                        [0, 0, -90, 1]
                    ]
                }
              }
            )
          }
    },

    fallingStarsKick2: function(time, duration) {
        const SboxLightScale = [1,0.05,1];
        for(var i = 0; i < 60; i++) {
            var stP = [-60 + 120*Math.random(), 16 + 20*Math.random(), 50 + 20*Math.random()];
            chroma._customEvents.push(
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "st"+i,
                    "_duration": duration,
                    "_position": [
                        stP.concat(0),
                        [stP[0], stP[1]- 5 - 8*Math.random(), stP[2], 0.999, "easeOutCubic"],
                        [0,0,-100,1]
                    ],
                    "_scale": [
                        SboxLightScale.concat(0),
                        [SboxLightScale[0], SboxLightScale[1]*0.8, SboxLightScale[2], 1, "easeOutCubic"]
                    ],
                    "_localRotation": [
                        [0, 0, 0, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), (90*Math.random()-45), 1, "easeOutCubic"]
                    ]
                }
              }
            )
          }
    },

    raisingStars: function(time, duration) {
        const SboxLightScale = [1,0.05,1];
        for(var i = 0; i < 60; i++) {
            var side = Math.random() > 0.5? true : false;
            var stP = [side?-10 + 20*Math.random() - 15 : -10 + 20*Math.random() + 15 , -5 + 25*Math.random(), 8 + 20*Math.random()];
            chroma._customEvents.push(
              {
                "_time": time,
                "_type": "AnimateTrack",
                "_data": {
                    "_track": "st"+i,
                    "_duration": duration,
                    "_position": [
                        stP.concat(0),
                        [stP[0], stP[1]+ 5 + 8*Math.random(), stP[2], 0.999],
                        [0,0,-100,1]
                    ],
                    "_scale": [
                        SboxLightScale.concat(0),
                        [SboxLightScale[0], SboxLightScale[1]*0.8, SboxLightScale[2], 1]
                    ],
                    "_localRotation": [
                        [0, 0, 0, 0],
                        [(90*Math.random()-45), (90*Math.random()-45), (90*Math.random()-45), 1]
                    ]
                }
              }
            )
          }
    },

    toogleRingSupports: function(time, status) {
        if(status) {
            chroma._customEvents.push(
                {
                  "_time": time,
                  "_type": "AnimateTrack",
                  "_data": {
                      "_track": "rs",
                      "_duration": 0.01,
                      "_scale": [
                          [0.001, 0.001, 0.001, 0],
                          [1, 1, 1, 1]
                      ]
                  }
                }
            )
            for(var i = 15; i >= 1; i--) {
                chroma._customEvents.push(
                    {
                        "_time": time,
                        "_type": "AnimateTrack",
                        "_data": {
                            "_track": "r"+i+"a",
                            "_duration": 0.01,
                            "_scale": [
                                [5,7.8,5,0],
                                [5,7.8,5,1]
                            ]
                        }
                    }
                );
            }
        }
        else {
            chroma._customEvents.push(
                {
                  "_time": time,
                  "_type": "AnimateTrack",
                  "_data": {
                      "_track": "rs",
                      "_duration": 0.01,
                      "_scale": [
                          [1, 1, 1, 0],
                          [0.001, 0.001, 0.001, 1]
                      ]
                  }
                }
            )
            for(var i = 15; i >= 1; i--) {
                chroma._customEvents.push(
                    {
                        "_time": time,
                        "_type": "AnimateTrack",
                        "_data": {
                            "_track": "r"+i+"a",
                            "_duration": 0.01,
                            "_scale": [
                                [12,7.8,12,0],
                                [12,7.8,12,1]
                            ]
                        }
                    },
                    {
                        "_time": time,
                        "_type": "AnimateTrack",
                        "_data": {
                            "_track": "r"+i+"b",
                            "_duration": 0.01,
                            "_scale": [
                                [12,7.8,12,0],
                                [12,7.8,12,1]
                            ]
                        }
                    },
                    {
                        "_time": time,
                        "_type": "AnimateTrack",
                        "_data": {
                            "_track": "r"+i+"c",
                            "_duration": 0.01,
                            "_scale": [
                                [12,7.8,12,0],
                                [12,7.8,12,1]
                            ]
                        }
                    },
                    {
                        "_time": time,
                        "_type": "AnimateTrack",
                        "_data": {
                            "_track": "r"+i+"d",
                            "_duration": 0.01,
                            "_scale": [
                                [12,7.8,12,0],
                                [12,7.8,12,1]
                            ]
                        }
                    }
                );
            }
        }
            
    },

    customRingsZoomShake,lasersLead,lasersLeadBack,rotLightLead,rotLightLeadBack

};

function customRingsZoom(time, from, to, duration, fromZ, toZ) {
    fromZ = fromZ ? fromZ : 0;
    toZ = toZ ? toZ : 0;
    for(var i = 15; i >= 1; i--) {
        chroma._customEvents.push(
            {
                "b": time,
                "t": "AnimateTrack",
                "d": {
                    "track": "r"+i,
                    "duration": duration,
                    "position": [
                        [0, 2, fromZ+18+from*(i-1), 0],
                        [0, 2, toZ+18+to*(i-1), 1, "easeOutSine"],
                    ]
                }
            }
        )
    }
}

function customRingsZoomShake(time, step, duration, force, shakesPerBeat, cubic, v3, customZ) {
    var zVal = (customZ&&customZ!=ringsZ)? customZ : ringsZ;
    var shakeCount = shakesPerBeat*duration;
    var easedArray = getEasedArray(shakeCount);
    if(cubic) {
        easedArray = getEasedArrayCubic(shakeCount);
    }
    for(var i = 15; i >= 1; i--) {
        var zStartPoint = ringsOffset[i-1];
        var zEndPoint = zVal + step*i;
        var zDistance = zEndPoint-zStartPoint;
        var zPositions = [];
        var zStep = zDistance/shakeCount;
        for(var j = 0; j < shakeCount; j++) {
            zPositions.push(zStartPoint + j*zStep);
        }
        var animationPoints = [];
        for(var j = 0; j < shakeCount; j++) {
            var xForce = Math.random()*force - force/2;
            var yForce = Math.random()*force - force/2;
            var pushX = 0+xForce;
            var pushY = 5+yForce;
            var pushZ = zPositions[j];
            pushPoint = easedArray[j];
            pushX = Math.round(pushX*100)/100;
            pushY = Math.round(pushY*100)/100;
            pushZ = Math.round(pushZ*100)/100;
            pushPoint = Math.round(pushPoint*1000)/1000;
            animationPoints.push([pushX,pushY,pushZ,pushPoint]);
        }
        if(v3) {
            chroma._customEvents.push(
                {
                    "b": time,
                    "t": "AnimateTrack",
                    "d": {
                        "track": "r"+i,
                        "duration": duration,
                        "localPosition": animationPoints
                    }
                }
            )
        }
        else{
            chroma._customEvents.push(
                {
                    "_time": time,
                    "_type": "AnimateTrack",
                    "_data": {
                        "_track": "r"+i,
                        "_duration": duration,
                        "_localPosition": animationPoints
                    }
                }
            )
        }

        ringsOffset[i-1] = zVal + step*i;
    }
}

function getEasedArray(count) {
    var step = 1.0/count;
    var result = [];
    for(var i = 0; i < count; i++) {
        result.push(easeOutSine(0,1,i*step));
    }
    return result;
}

function getEasedArrayCubic(count) {
    var step = 1.0/count;
    var result = [];
    for(var i = 0; i < count; i++) {
        result.push(easeOutCubic(0,1,i*step));
    }
    return result;
}

function easeOutCubic(start, end, value) {
    value--;
    end -= start;
    return end * (value * value * value + 1) + start;
}

function easeOutSine(start, end, value)
{
    end -= start;
    return end * Math.sin(value * (Math.PI * 0.5)) + start;
}

function lasersLead(time, duration, color) {
    rotLightLead(time, duration, 0, color);
    rotLightLead(time, duration, 1, color);
}

function lasersLeadBack(time, duration, color) {
    rotLightLeadBack(time, duration, 0, color);
    rotLightLeadBack(time, duration, 1, color);
}

//side 0-1
function rotLightLead(time, duration, side, color) {
    period = duration/rotationLights.length;
    for(var i = 0; i < rotationLights.length; i++) {
      if(side == 0) {
        turnRotLightLeft(time, i, color);
        turnOffRotLightLeft(time+4*period, i);
      }
      else {
        turnRotLightRight(time, i, color);
        turnOffRotLightRight(time+4*period, i);
      }
      time += period;
    }
  }
  
  //side 0-1
  function rotLightLeadBack(time, duration, side, color) {
    period = duration/rotationLights.length;
    for(var i = rotationLights.length -1 ; i >=0; i--) {
      if(side == 0) {
        turnRotLightLeft(time, i, color);
        turnOffRotLightLeft(time+4*period, i);
      }
      else {
        turnRotLightRight(time, i, color);
        turnOffRotLightRight(time+4*period, i);
      }
      time += period;
    }
  }

  function turnRotLightLeft(time, id, color) {
    chroma._events.push(
      {
              "b": time,
              "et": 2,
              "i": 5,
              "f": 1,
              "customData": {
                  "lightID": rotationLights[id],
                  "color": color
              }
          }
    )
  }
  
  function turnRotLightRight(time, id, color) {
    chroma._events.push(
      {
              "b": time,
              "et": 3,
              "i": 5,
              "f": 1,
              "customData": {
                  "lightID": rotationLights[id],
                  "color": color
              }
          }
    )
  }
  
  function turnOffRotLightLeft(time, id) {
    chroma._events.push(
      {
              "b": time,
              "et": 2,
              "i": 0,
              "f": 1,
              "customData": {
                  "lightID": rotationLights[id]
              }
          }
    )
  }
  
  function turnOffRotLightRight(time, id) {
    chroma._events.push(
      {
              "b": time,
              "et": 3,
              "i": 0,
              "f": 1,
              "customData": {
                  "lightID": rotationLights[id]
              }
          }
    )
  }