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
    showWaveformBars    : false,
    customBarColor      : false,
    customBarGradient   : false,
    grayScale           : 0,
    barRadius           : 200,
    circleClusters      : 1,
    circleRadius        : 200,
    circle1             : "#FF6F6F",
    circle2             : "#0000FF",
    circle3             : "#C8C800"
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

const audioFilters = {
    trebleAmount    : 0,
    bassAmount      : 0
}

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

let currentTime, duration;

function init(){
	console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    
    const gui = new dat.GUI({ width: 400 });
    gui.close();

    let trackControl = gui.addFolder("Track Control");
    trackControl.add(controllerObject, 'trackSelect', ["New Adventure Theme", "Peanuts Theme", "The Picard Song", "Never Gonna Give You Up"]);
    trackControl.add(audioFilters, "trebleAmount", 0, 1000);
    trackControl.add(audioFilters, "bassAmount", 0, 1000);

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
    canvasControls.add(drawParams, "grayScale", 0, 1, .01);

    let barControl = gui.addFolder("Bar Controls");
    barControl.add(drawParams, "customBarColor");
    barControl.addColor(canvas.customControls, "barColorSolid");
    barControl.add(drawParams, "customBarGradient")
    barControl.addColor(canvas.customControls, "barGradient1");
    barControl.addColor(canvas.customControls, "barGradient2");
    barControl.add(drawParams, "barRadius", 150, 450);

    let circleControl = gui.addFolder("Cirlce Controls");
    circleControl.add(drawParams, "circleClusters", 1, 5, 1);
    circleControl.add(drawParams, "circleRadius", 50, 450);
    circleControl.addColor(drawParams, "circle1");
    circleControl.addColor(drawParams, "circle2");
    circleControl.addColor(drawParams, "circle3");

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

    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        if(audio.audioCtx.state == "suspended"){
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if(e.target.dataset.playing == "no"){
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        }else{
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }
    };

    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    volumeSlider.oninput = e => {
        audio.setVolume(e.target.value);
        volumeLabel.innerHTML = Math.round((e.target.value/2*100));
    };

    volumeSlider.dispatchEvent(new Event("input"));

    document.querySelector("#upload").onchange = (e) => {
        const files = e.target.files;
        audio.loadSoundFile(URL.createObjectURL(files[0]));
    };
} // end setupUI

function loop(){
    /* NOTE: This is temporary testing code that we will delete in Part II */
        requestAnimationFrame(loop);
        canvas.draw(drawParams);

        let timer = document.querySelector("#time");
        let totalTime = audio.getProgress();
        timer.innerHTML = `${Math.floor(totalTime/60)}:${padStart((totalTime % 60).toFixed(0), 2)}`;

        let filters = document.querySelectorAll(".filter");

        for(let i = 0; i < filters.length; i++){
            if(filters[i].checked){
                if(filters[i].value == "treble"){
                    audio.toggleHighshelf(audioFilters.trebleAmount, true);
                    audio.toggleLowshelf(0,false);
                } else if(filters[i].value == "bass"){
                    audio.toggleHighshelf(0, false);
                    audio.toggleLowshelf(audioFilters.bassAmount,true);
                } else {
                    audio.toggleHighshelf(0, false);
                    audio.toggleLowshelf(0,false);
                }
            }
        }
    }

    function padStart(number, size){
        let s = String(number);
        while(s.length < (size || 2)) {s = '0' + s};
        return s;
    }

export {init};