/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData, rot = 0, maxBarRadius = 200, audioData2,averageLoudness = 0, medianLoudness = 0;
let customControls = {
    color1          : "#FFFFFF",
    color2          : "#FFFFFF",
    barColorSolid   : "#FFFFFF",
    barGradient1    : "#FFFFFF",
    barGradient2    : "#FFFFFF"
};


function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#33ccff"},{percent:1,color:"#ccff33"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);
    audioData2 = new Uint8Array(analyserNode.fftSize/2);
    for(let i = 0; i < audioData.length; i++){
        averageLoudness += audioData[i];
    }
    averageLoudness /= audioData.length;
    averageLoudness /= 255;
    medianLoudness = audioData[audioData/2];
    medianLoudness /= audioData.length;
}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	analyserNode.getByteTimeDomainData(audioData2); // waveform data
	
	// 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
	if(params.showGradient){
        ctx.save();
        gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#33ccff"},{percent:1,color:"#ccff33"}]);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }

    if(params.showCustom){
        ctx.save();
        ctx.fillStyle = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:`${customControls.color1}`},{percent:1,color:`${customControls.color2}`}]);
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    // 4 - draw bars
    if(params.showBars){
        let barWidth = (canvasWidth)/audioData.length;
        let baseHeight=5;
        
        // loop through the data and draw!
        for(let i=0; i<audioData.length; i++)
        {   
            ctx.save();

            if(params.customBarColor){
                ctx.fillStyle = customControls.barColorSolid;
            }else if (params.customBarGradient){
                ctx.fillStyle = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:`${customControls.barGradient1}`},{percent:1,color:`${customControls.barGradient2}`}]);
            }else {
                ctx.fillStyle = gradient;
            }

            /*if(invert){
                ctx.fillStyle="#ec7696"
            }*/
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate((Math.PI * 2 * (i / (audioData.length-40)))+ (rot -= .00002));

            ctx.beginPath();
            ctx.fillRect(0,params.barRadius,barWidth-2, baseHeight+audioData[i]*.6);
            ctx.restore();
        } 
    }

    if(params.showWaveformBars){
        let barWidth = (canvasWidth)/audioData2.length;
        let baseHeight=5, barSpacing = 4, margin = 5, screenWidth = canvasWidth - (audioData2.length * barSpacing) - margin * 2;
        
        // loop through the data and draw!
        for(let i=0; i<audioData2.length; i++)
        {   
            ctx.save();

            if(params.customBarColor){
                ctx.fillStyle = customControls.barColorSolid;
            }else if (params.customBarGradient){
                ctx.fillStyle = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:`${customControls.barGradient1}`},{percent:1,color:`${customControls.barGradient2}`}]);
            }else {
                ctx.fillStyle = gradient;
            }
            
            /*if(invert){
                ctx.fillStyle="#ec7696"
            }*/
            ctx.beginPath();
            ctx.fillRect(margin + i * (barWidth + barSpacing),canvasHeight/2,barWidth-2, baseHeight+audioData2[i] * .6);
            ctx.fillRect(margin + i * (barWidth + barSpacing),baseHeight+audioData2[i] * .6,barWidth-2, (canvasHeight/2) - baseHeight + audioData2[i] * .6);
            ctx.restore();
        } 
    }
	
    // 5 - draw circles
    if(params.showCircles){
        let maxRadius = canvasHeight/4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i = 0; i < audioData.length; i++){
            let percent = audioData[i] / 255;

            let circleRadius = percent * params.circleRadius;
            ctx.beginPath();
            ctx.globalAlpha = .34 - percent/3.0;
            ctx.fillStyle = params.circle1;
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.globalAlpha = .10-percent/10.0;
            ctx.fillStyle = params.circle2;
            ctx.arc(canvasWidth/2,canvasHeight/2,circleRadius*1.5,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();

            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha = .5-percent/5.0;
            ctx.fillStyle = params.circle3;
            ctx.arc(canvasWidth/2,canvasHeight/2,circleRadius*.50,0,2*Math.PI,false)
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            if(params.circleClusters > 1){
                circleRadius = (percent * params.circleRadius) / 4;

                ctx.beginPath();
                ctx.globalAlpha = .34 - percent/3.0;
                ctx.fillStyle = params.circle1;
                ctx.arc(canvasWidth/8, canvasHeight/4, circleRadius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.globalAlpha = .10-percent/10.0;
                ctx.fillStyle = params.circle2;
                ctx.arc(canvasWidth/8,canvasHeight/4,circleRadius*1.5,0,2*Math.PI,false);
                ctx.fill();
                ctx.closePath();

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = .5-percent/5.0;
                ctx.fillStyle = params.circle3;
                ctx.arc(canvasWidth/8,canvasHeight/4,circleRadius*.50,0,2*Math.PI,false)
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
            if(params.circleClusters > 2){
                circleRadius = (percent * params.circleRadius) / 4;

                ctx.beginPath();
                ctx.globalAlpha = .34 - percent/3.0;
                ctx.fillStyle = params.circle1;
                ctx.arc(7 * canvasWidth/8, canvasHeight/4, circleRadius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.globalAlpha = .10-percent/10.0;
                ctx.fillStyle = params.circle2;
                ctx.arc(7 * canvasWidth/8,canvasHeight/4,circleRadius*1.5,0,2*Math.PI,false);
                ctx.fill();
                ctx.closePath();

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = .5-percent/5.0;
                ctx.fillStyle = params.circle3;
                ctx.arc(7 * canvasWidth/8,canvasHeight/4,circleRadius*.50,0,2*Math.PI,false)
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
            if(params.circleClusters > 3){
                circleRadius = (percent * params.circleRadius) / 4;

                ctx.beginPath();
                ctx.globalAlpha = .34 - percent/3.0;
                ctx.fillStyle = params.circle1;
                ctx.arc(canvasWidth/8, 3 * canvasHeight/4, circleRadius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.globalAlpha = .10-percent/10.0;
                ctx.fillStyle = params.circle2;
                ctx.arc(canvasWidth/8,3 * canvasHeight/4,circleRadius*1.5,0,2*Math.PI,false);
                ctx.fill();
                ctx.closePath();

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = .5-percent/5.0;
                ctx.fillStyle = params.circle3;
                ctx.arc(canvasWidth/8, 3 * canvasHeight/4,circleRadius*.50,0,2*Math.PI,false)
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
            if(params.circleClusters > 4){
                circleRadius = (percent * params.circleRadius) / 4;

                ctx.beginPath();
                ctx.globalAlpha = .34 - percent/3.0;
                ctx.fillStyle = params.circle1;
                ctx.arc(7 * canvasWidth/8, 3 * canvasHeight/4, circleRadius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.globalAlpha = .10-percent/10.0;
                ctx.fillStyle = params.circle2;
                ctx.arc(7 * canvasWidth/8,3 * canvasHeight/4,circleRadius*1.5,0,2*Math.PI,false);
                ctx.fill();
                ctx.closePath();

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = .5-percent/5.0;
                ctx.fillStyle = params.circle3;
                ctx.arc(7 * canvasWidth/8, 3 * canvasHeight/4,circleRadius*.50,0,2*Math.PI,false)
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
        }
        ctx.restore();
    }

    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
	
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for(let i = 0; i < length; i+=4){
		// C) randomly change every 20th pixel to red
        if(params.showNoise && Math.random() < .05){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
            // data[i+3] is the alpha channel
			data[i]= data[i+1] = data[i + 2] = 0;// zero out the red and green and blue channels
            data[i] = 75, data[i+2] = 130;// make the red channel 100% red
        } // end if
        
        if(params.showInvert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i+1] = 255 - green;
            data[i+2] = 255 - blue;
        }

        let average = (data[i] + data[i+1] + data[i+2])/3;
        let saturated = params.grayScale * average;
        let oppositeValue = 1-params.grayScale;

        data[i] = oppositeValue * data[i] + saturated;
        data[i+1] = oppositeValue * data[i+1] + saturated;
        data[i+2] = oppositeValue * data[i+2] + saturated;
    } // end for
    
    if(params.showEmboss){
        for(let i = 0; i < length; i++){
            if(i%4 == 3) continue;
            data[i] = 127 + 2 * data[i] - data[i+4] - data[i + width * 4];
        }
    }
	
	// D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

export {setupCanvas,draw, customControls};