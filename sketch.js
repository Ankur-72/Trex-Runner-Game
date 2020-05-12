var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trexrunning, trexcollided

var ground, invisibleground, groundimage

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstacleGroup

var cloud, cloudGroup, cloudimage

var gameOver, gameOverimage

var restart, restartimage

localStorage["HighestScore"] = 0;

var score = 0;

let song,song1,song2;

function preload() {

  groundimage = loadImage("ground2.png");

  trex_collided = loadAnimation("trex_collided.png");
  trexrunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  cloudimage = loadImage("cloud.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");


}


function setup() {

  createCanvas(600, 200);
  
  song = loadSound("jump.mp3");
  song1 = loadSound("checkPoint.mp3");
  song2 = loadSound("die.mp3");

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trexrunning);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.55;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundimage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100);

  invisibleground = createSprite(200, 190, 400, 10);
  invisibleground.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);


  restart = createSprite(300, 140, 10, 10);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  CloudGroup = new Group();
  ObstacleGroup = new Group();

}

function draw() {
  background(180);

  text("Score:" + score, 500, 50);

  if (gameState === PLAY) {

    score = score + Math.round(getFrameRate() / 60);

    spawnClouds();
    spawnObstacles();

    if (keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12.25;
      space();
     
      
    }
    
    if (score > 0 && score%100 === 0) {
      check();
    }

    trex.velocityY = trex.velocityY + 0.8;
    //console.log(trex.y);

    ground.velocityX = -3;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    trex.collide(invisibleground);

    if (ObstacleGroup.isTouching(trex)) {
      die();
      gameState = END;
    }

  }

  if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstacleGroup.setVelocityXEach(0);
    CloudGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    ObstacleGroup.setLifetimeEach(-1);
    CloudGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    CloudGroup.add(cloud);
  }

}


function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -6;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    ObstacleGroup.add(obstacle);
  }
}

function reset() {
  // to change the gameState to PLAY
  gameState = PLAY;
  // to make the sprites invisible
  gameOver.visible = false;
  restart.visible = false;
  // to destroy the obstacles and clouds present when the game ends
  ObstacleGroup.destroyEach();
  CloudGroup.destroyEach();
  // to change the animation of the trex
  trex.changeAnimation("running", trexrunning);


  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }
  //console.log(localStorage["HighestScore"]); score = 0;

  // to make count as 0
  score = 0;
}

function space(){
if (keyDown("space")){
 song.play(); 
} else {
  song.stop();
}  
  }


function die (){
    song2.play();
  }

function check (){
  song1.play();
}