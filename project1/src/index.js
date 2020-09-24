"use strict";

let canvas, ctx;
const canvasWidth = 800, canvasHeight = 600;
const cellWidth = 10;
const fps = 12;
let lifeworld;

window.onload = init;

function init(){
	canvas = document.querySelector("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    lifeworld = new lifeWorld(80,60,.2);
	// TODO: init lifeworld
	loop();
}

function loop(){
	setTimeout(loop,1000/fps);
	lifeworld.step();
	drawBackground();
	drawWorld();
}

function drawBackground(){
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = 4/fps;
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
    rjsLIB.drawRect(ctx,col*dimensions,row*dimensions,dimensions,dimensions,`${alive ? 'red' : 'rgba(0,0,0,0)'}`,1,`${'rgba(0,0,255,.2)'}`);
    /*ctx.beginPath();
    ctx.rect(col*dimensions,row*dimensions,dimensions,dimensions);
    ctx.fillStyle = alive ? 'red' : 'rgba(0,0,0,0)';
    ctx.fill();*/
}