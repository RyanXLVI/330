"use strict";

console.log("loaded");

(function(){

    let rjsLIB = {
        getRandomColor(){
            const getByte = _ => 55 + Math.round(Math.random() * 200);
            return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
        },

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        drawRect(ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black"){
            ctx.save();
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.rect(x,y,width,height);
            ctx.closePath();
            ctx.fill();
            if(lineWidth > 0){
                ctx.strokeStyle = strokeStyle;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            }
            ctx.restore();
        },

        drawCircle(ctx,x,y,radius,fillStyle="black"){
            ctx.save();
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.arc(x,y,radius,0,Math.PI*2,false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },

        drawLine(ctx,startX,startY,endX,endY,strokeStyle="black",lineWidth){
            ctx.save();
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(startX,startY);
            ctx.lineTo(endX,endY);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    };

    if(window){
        window["rjsLIB"] = rjsLIB;
    }else{
        throw "'window' is not defined! ";
    }
})();