/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
    showGradient        : true,
    showBars            : true,
    showCircles         : true,
    showNoise           : false,
    showInvert          : false,
    showEmboss          : false,
    showCustom          : false,
    showWaveform        : false,
    showWaveformBars    : false,
    customBarColor      : false,
    customBarGradient   : false
};

const controllerObject = {
    _trackSelect    :   "New Adventure Theme",

    set trackSelect(value){
        this._trackSelect = value;
        audio.loadSoundFile(`media/${value}.mp3`);
    },

    get trackSelect(){
        return this._trackSelect;
    }

    
}

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
	console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    
    const gui = new dat.GUI({ width: 400 });
    gui.close();

    let trackControl = gui.addFolder("Track Selections");
    trackControl.add(controllerObject, 'trackSelect', ["New Adventure Theme", "Peanuts Theme", "The Picard Song", "Never Gonna Give You Up"]);

    let gradientControls = gui.addFolder("Gradient Controls");
    gradientControls.add(drawParams, "showGradient");
    gradientControls.add(drawParams, "showCustom");
    gradientControls.addColor(canvas.customControls, "color1");
    gradientControls.addColor(canvas.customControls, "color2");

    let canvasControls = gui.addFolder("Canvas Control");
    canvasControls.add(drawParams, "showBars");
    canvasControls.add(drawParams, "showCircles");
    canvasControls.add(drawParams, "showNoise");
    canvasControls.add(drawParams, "showInvert");
    canvasControls.add(drawParams, "showEmboss");
    canvasControls.add(drawParams, "showWaveformBars");
    canvasControls.add(drawParams, "showWaveform");

    let barControl = gui.addFolder("Bar Controls");
    barControl.add(drawParams, "customBarColor");
    barControl.addColor(canvas.customControls, "barColorSolid");
    barControl.add(drawParams, "customBarGradient")
    barControl.addColor(canvas.customControls, "barGradient1");
    barControl.addColor(canvas.customControls, "barGradient2");


	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    audio.setupWebaudio(DEFAULTS.sound1);
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
  const playButton = document.querySelector("#playButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };
} // end setupUI

function loop(){
    /* NOTE: This is temporary testing code that we will delete in Part II */
        requestAnimationFrame(loop);
        canvas.draw(drawParams);
        // 1) create a byte array (values of 0-255) to hold the audio data
        // normally, we do this once when the program starts up, NOT every frame
        let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
        
        // 2) populate the array of audio data *by reference* (i.e. by its address)
        //audio.analyserNode.getByteFrequencyData(audioData);
        
        /* 3) log out the array and the average loudness (amplitude) of all of the frequency bins
            console.log(audioData);
            
            console.log("-----Audio Stats-----");
            let totalLoudness =  audioData.reduce((total,num) => total + num);
            let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
            let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
            let maxLoudness =  Math.max(...audioData); // ditto!
            // Now look at loudness in a specific bin
            // 22050 kHz divided by 128 bins = 172.23 kHz per bin
            // the 12th element in array represents loudness at 2.067 kHz
            let loudnessAt2K = audioData[11]; 
            console.log(`averageLoudness = ${averageLoudness}`);
            console.log(`minLoudness = ${minLoudness}`);
            console.log(`maxLoudness = ${maxLoudness}`);
            console.log(`loudnessAt2K = ${loudnessAt2K}`);
            console.log("---------------------");
        */
    }

export {init};