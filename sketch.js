const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var balls = [];
var boats = [];

//variáveis da animação do barco navegando
var boatAnimation = [];
var boatSpritesheet,boatSpriteData;


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  //carregando arquivos da animação do barco navegando
  boatSpriteData = loadJSON("./assets/boat/boat.json");
  boatSpritesheet = loadImage("./assets/boat/boat.png");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  //criando a animação do barco navegando
  var boatFrames = boatSpriteData.frames;
  for (let i = 0; i < boatFrames.length; i++) {
    let pos = boatFrames[i].position;
    let img = boatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  }

  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  
  rect(ground.position.x, ground.position.y, width * 2, 1);
 

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);

    collisionWithBoat(i);
  }

  showBoats();

  cannon.display();
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      ball.removeBalls(index);
    }
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1].body.position.x < width - 300 || boats[boats.length - 1] == undefined) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(width - 79, height - 60, 170, 170, position,boatAnimation);
      boats.push(boat);
    }
    for (let i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {x: -0.9, y: 0})
        boats[i].animate()
        boats[i].display();
      }
    }
  }
  else{
    var boat = new Boat(width - 79, height - 60, 170, 170, -80,boatAnimation);
    boats.push(boat);
  }
}

function collisionWithBoat(j) {
  for (let i = 0; i < boats.length; i++) {
    if (balls[j] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[j].body, boats[i].body);
      if (collision.collided) {
        boats[i].removeBoats(i);
        Matter.World.remove(world, balls[j].body);
        balls.splice(j, 1);
      }
    }
  }
}
