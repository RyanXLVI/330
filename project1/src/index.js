"use strict";

let canvas, ctx;
const canvasWidth = 800, canvasHeight = 600;
let cellWidth = 10;
let fps = 12;
let lifeworld;
let displayGrid = true;
let displayTrails = true;
let widthRadios;
let paused = false;


window.onload = init;

function init(){
    widthRadios = document.querySelectorAll(".cellSize");
	canvas = document.querySelector("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    lifeworld = new lifeWorld(80,60,.2);

    for(let i = 0, length = widthRadios.length; i < length; i++){
        widthRadios[i].onchange = widthChanged;
    }
	// TODO: init lifeworld
    loop();
    setupUI();
}

function widthChanged(){
    for(let i = 0, length = widthRadios.length; i < length; i++){
        if(widthRadios[i].checked){
            cellWidth = widthRadios[i].value;
        }
    }
    lifeworld = new lifeWorld(canvasWidth/cellWidth, canvasHeight/cellWidth,.2);
    resetWorld();
}

function resetWorld(){
    if(document.querySelector("#percentAlive").value != ""){
        lifeworld = new lifeWorld(canvasWidth/cellWidth, canvasHeight/cellWidth,document.querySelector("#percentAlive").value)
    }
    else
        lifeworld.randomSetup();
}

function setupUI(){
    document.querySelector("#grid").onchange = function(e){
        displayGrid = e.target.checked;
    };
    document.querySelector("#trails").onchange = function(e){
        displayTrails = e.target.checked;
    };
    document.querySelector("#resetButton").onclick = function(){
        resetWorld();
    };
    document.querySelector("#playButton").onclick = function(){
        paused = false;
        loop();
    };
    document.querySelector("#pauseButton").onclick = function(){
        paused = true;
    };
    document.querySelector("#stepButton").onclick = function(){
        lifeworld.step();
        drawBackground();
        drawWorld();
    };
}

function loop(){
    if(paused)
        return;
	setTimeout(loop,1000/fps);
	lifeworld.step();
	drawBackground();
    drawWorld();
    
    let fpsRadios = document.querySelectorAll(".fpsRadio");

    for(let i = 0, length = fpsRadios.length; i < length; i++){
        if(fpsRadios[i].checked){
            fps = fpsRadios[i].value;
        }
    }
}

function drawBackground(){
	ctx.save();
    ctx.fillStyle = "black";
    if(displayTrails)
        ctx.globalAlpha = 4/fps;
    else
        ctx.globalAlpha = 1;
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.restore();
}

function drawWorld(){
    ctx.save();
    for(let col = 0; col < lifeworld.numCols; col++){
        for(let row = 0; row < lifeworld.numRows; row++){
            drawCell(col,row,cellWidth,lifeworld.world[col][row]);
        }
    }
    ctx.restore();
}

function drawCell(col,row,dimensions,alive) {

    let color;
    let radios = document.querySelectorAll(".cellColor");
    for(let i = 0, length = radios.length; i < length; i++){
        if(radios[i].checked){
            color = radios[i].value;
        }
    }

    if(displayGrid)
        rjsLIB.drawRect(ctx,col*dimensions,row*dimensions,dimensions,dimensions,`${alive ? color : 'rgba(0,0,0,0)'}`,1,`${'rgba(0,0,255,.2)'}`);
    else
        rjsLIB.drawRect(ctx,col*dimensions,row*dimensions,dimensions,dimensions,`${alive ? color : 'rgba(0,0,0,0)'}`);
}