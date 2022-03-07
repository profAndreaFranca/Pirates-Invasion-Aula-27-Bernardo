class Boat{
    constructor(x,y,width,height,boatPos,boatAnimation){
        this.body = Bodies.rectangle(x,y,width,height);
        this.w = width;
        this.h = height;
        this.boatPos = boatPos;
        this.animation = boatAnimation;
        this.speed = 0.05;
        this.isBroken = false;
        this.image = loadImage("./assets/boat.png");
        World.add(world,this.body);
    }

    animate(){
        this.speed += 0.05;
    }

    removeBoats(index){
        setTimeout(()=>{
            Matter.World.remove(world, boats[index].body);
            delete boats[index];
        }, 2000)
    }

    display(){
        var angle = this.body.angle;
        var pos = this.body.position;
        //criando o índice do array da animação
        var index = floor(this.speed % this.animation.length) //floor arredonda para um inteiro menor
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.animation[index], 0, this.boatPos, this.w, this.h);
        pop();
    }

}
