// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, analyserNode, gainNode, highshelfFilter, lowshelfFilter, currentTime = 0, duration = 0;

// 3 - here we are faking an enumeration
const DEFAULT = Object.freeze({
    gain        :       .5,
    numSamples  :       256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULT.numSamples/2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
function setupWebaudio(filePath){
// 1 - The || is because WebAudio has not been standardized across browsers yet
const AudioContext = window.AudioContext || window.webkitAudioContext;
audioCtx = new AudioContext();

// 2 - this creates an <audio> element
element = new Audio();

// 3 - have it point at a sound file
loadSoundFile(filePath);

// 4 - create an a source node that points at the <audio> element
sourceNode = audioCtx.createMediaElementSource(element);

// 5 - create an analyser node
// note the UK spelling of "Analyser"
analyserNode = audioCtx.createAnalyser();
/*
// 6
We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
across the sound spectrum.

If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
the amplitude of that frequency.
*/ 

// fft stands for Fast Fourier Transform
analyserNode.fftSize = DEFAULT.numSamples;

// 7 - create a gain (volume) node
gainNode = audioCtx.createGain();
gainNode.gain.value = DEFAULT.gain;

highshelfFilter = audioCtx.createBiquadFilter();
highshelfFilter.type = "highshelf";

lowshelfFilter = audioCtx.createBiquadFilter();
lowshelfFilter.type = "lowshelf";

// 8 - connect the nodes - we now have an audio graph
sourceNode.connect(analyserNode);
analyserNode.connect(highshelfFilter);
highshelfFilter.connect(lowshelfFilter);
lowshelfFilter.connect(gainNode);
gainNode.connect(audioCtx.destination);

}

function loadSoundFile(filePath){
    element.src = filePath;
    duration = element.duration;
    console.log(duration);
}

function playCurrentSound(){
    element.play();
}

function pauseCurrentSound(){
    element.pause();
}

function setVolume(value){
    value = Number(value);
    gainNode.gain.value = value;
}

function getProgress(){
    if(!element.currentTime){
        currentTime=0;
    } else {
        currentTime = element.currentTime;
    }

    return currentTime;
}

function getPercentage(currentTime, duration){
    if(!currentTime || !duration){
        return 0;
    } else {
        return currentTime / duration;
    }
}

function toggleLowshelf(value, lowshelf = false){
    if(lowshelf){
        lowshelfFilter.frequency.setValueAtTime(value, audioCtx.currentTime);
        lowshelfFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        lowshelfFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function toggleHighshelf(value, highshelf = false){
    if(highshelf){
        highshelfFilter.frequency.setValueAtTime(value, audioCtx.currentTime);
        highshelfFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        highshelfFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

export{audioCtx,setupWebaudio,playCurrentSound,pauseCurrentSound,loadSoundFile,setVolume,toggleHighshelf,toggleLowshelf,getProgress,getPercentage,analyserNode};