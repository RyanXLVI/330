import * as main from "./main.js";

class Sprite{
    constructor(x=0,y=0,span=10,fwd={x:1,y:0},speed=0,color="black"){
        this.x = x;
        this.y = y;
        this.span = span;
        this.fwd = fwd;
        this.speed = speed;
        this.color = color;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.beginPath();
        ctx.rect(-this.span/2,-this.span/2,this.span, this.span);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    move(){
        this.x += this.fwd.x * this.speed;
        this.y += this.fwd.y * this.speed;
    }

    reflectX(){
        this.fwd.x *= -1;
    }

    reflectY(){
        this.fwd.y *= -1;
    }
}

class RingSprite extends Sprite{
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.beginPath();
        ctx.arc(0,0,this.span/2,0,Math.PI * 2,false);
        ctx.arc(0,0,this.span/4,0,Math.PI * 2,true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    
}

class ImageSprite extends Sprite{
    constructor(x=0,y=0,span=10,fwd={x:1,y:0},speed=0,image){
        super(x,y,span,fwd,speed);
        this.image = image;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.drawImage(main.spriteImage, -this.span/2,-this.span/2,this.span, this.span);
        ctx.restore();
    }
}

export{Sprite, ImageSprite, RingSprite};