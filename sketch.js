var goldCoin, goldCoinImg;
var flyBot, flyBotAnimation;
var background1, background1Img;
var emoji;
var score = 0;
var spikes, spikesImg;
var goldCoinGroup, spikesGroup;
var PLAY = 1
var END = 0;
var gameState = PLAY;
var die;
var restart, restartImg;
var checkpoint;
var backgroundMusic;
var alien, alienImg, alienGroup;


function preload() {
  //background2Img = loadImage("bk1.png");
  //background3Img = loadImage("bk2.png");
  //background4Img = loadImage("bk3.png");
  background1Img = loadImage("assets/bk.png");

  goldCoinImg = loadImage("assets/goldCoin.png");

  emoji = loadImage("assets/Emojil.png");

  spikesImg = loadImage("assets/spike.png");

  flyBotAnimation = loadAnimation("assets/flyBot_0.png", "assets/flyBot_1.png");

  restartImg = loadImage("assets/restart.png");

  die = loadSound("assets/die.mp3");

  checkpoint = loadSound("assets/jump.mp3");
  
  alienImg = loadImage("assets/flying_alien.png");
  
}


function setup() {
  createCanvas(800, 400);

  background1 = createSprite(120, 100, 600, 20);
  background1.addImage("background1", background1Img);
  //background1.scale = 0.4;
  flyBot = createSprite(80, 326, 20, 20);
  flyBot.addAnimation("flyBot", flyBotAnimation);
  flyBot.scale = 0.35
  //flyBot.velocityY = -7.5;

  restart = createSprite(400, 200, 20, 20);
  restart.addImage("restart", restartImg);
  restart.visible = false;
  

  edges = createEdgeSprites();

  background1.velocityX = -(8+5*score/1000);
  spikesGroup = new Group();

  goldCoinGroup = new Group();
  
  alienGroup = new Group();
}

function draw() { 
  background("white");
  text("Score: "+score, 710, 30);
  //score+= Math.round(frameRate()/60);
  if(gameState === PLAY) {
    
  score+= Math.round(frameRate()/60);
  spawnCoins();
  spawnSpikes();
  randomAlien();

  //text(mouseX+","+mouseY,mouseX,mouseY);

  if(background1.x<0) {
    background1.x = background1.width/2;
  }

  if(keyDown(DOWN_ARROW) || keyCode === 87) {
    flyBot.y+=25;
  }

  if(keyDown(UP_ARROW) || keyCode === 83) {
    flyBot.y-=25;
  }
 
  if(flyBot.y>325) {
    flyBot.y = 325;
  }
  if(spikesGroup.isTouching(flyBot)) {
    gameState = END
  }

  if(alienGroup.isTouching(flyBot)) {
    gameState = END;
  }

  /*if(flyBot.isTouching(edges)) {
    gameState = END;

  }*/
  flyBot.collide(goldCoinGroup,removeGoldCoins)




  if(flyBot.y<35) {
    flyBot.y = 35;
  }

  if (score%500 === 0 && score>0) {
    checkpoint.play();
   }
  }

  else if(gameState === END) {
    gameOver();
    if(mousePressedOver(restart)) {
      reset();
    }

  }

  createEdgeSprites();
  drawSprites();
}


function spawnCoins() {
  if(frameCount%27 === 0) {
    goldCoin = createSprite(100, 300, 20, 20);
    goldCoin.addImage("goldCoin", goldCoinImg);
    goldCoin.scale = 0.05;
    goldCoinGroup.add(goldCoin);
    goldCoin.y = Math.round(random(50, 300));
    goldCoin.x = 795;
    goldCoin.lifetime = 800;
    goldCoin.velocityX =  -(8+5*score/1000);
  }
}

function spawnSpikes() {
  if (frameCount%15 === 0) {
    spikes = createSprite(200, 200, 10, 10);
    spikes.addImage("spikes", spikesImg);
    spikes.scale = 0.15;
    spikesGroup.add(spikes);
    spikes.y = Math.round(random(5, 340));
    spikes.x = 795
    spikes.lifetime = 800;
    spikes.velocityX =  -(8+5*score/1000);
    //spikes.debug = true;
    spikes.setCollider("circle", 0, 0, 78)
  }
}

function gameOver() {
  background1.velocityX = 0;
  flyBot.velocityY = 0;
  flyBot.velocityX = 0;
  spikesGroup.setVelocityXEach(0);
  goldCoinGroup.setVelocityXEach(0);
  alienGroup.setVelocityXEach(0);
  spikesGroup.setLifetimeEach(-1);
  goldCoinGroup.setLifetimeEach(-1);
  alienGroup.setLifetimeEach(-1);
  die.play();
  restart.visible = true;
}

function reset() {
  gameState = PLAY;
  score = 0;
  goldCoinGroup.destroyEach();
  spikesGroup.destroyEach();
  alienGroup.destroyEach()
  restart.visible = false;
  //flyBot.velocityY = -20;
  flyBot.x = 80;
  flyBot.y = 326;
}

function removeGoldCoins(sprite,obstacle) {
  obstacle.remove();
  score+=50
  //flyBot.velocityY = -10;
  flyBot.velocityX = 0;
}

function randomAlien() {
  if(frameCount%500 === 0) {
    alien = createSprite(200, 200, 10, 10);
    alien.addImage("alien", alienImg);
    alien.scale = 0.45;
    alienGroup.add(alien);
    alien.y = Math.round(random(5, 320));
    alien.x = 795
    alien.lifetime = 800;
    alien.velocityX =  -(8+5*score/1000);  
    //alien.debug = true;
    alien.setCollider("circle", 0, 0, 80);
  }

  alienGroup.depth = spikesGroup.depth = goldCoinGroup.depth;
  alienGroup.depth+=1;

}