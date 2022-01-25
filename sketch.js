var bg,bgImg;
var player, shooterImg, shooter_shooting;
var heart_1,heart_2,heart_3;
var ZombieImg;
var winSound,loseSound,ExplosionS;
var heart1,heart2,heart3;
var zombieGrp,bulletGrp;
var bullet,bulletImg;
var life=3;
var score=0;
var bullets=100;
var gameState="play";
var gameOver,gameOverImg;
var reset,resetImg;
var win, winImg;
var NewGame,NewGameImg;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png");
  heart_1 = loadImage("assets/heart_1.png");
  heart_2 = loadImage("assets/heart_2.png");
  heart_3 = loadImage("assets/heart_3.png");
  ZombieImg = loadImage("assets/zombie.png");
  bulletImg = loadImage("assets/bullet with fire.png");
  gameOverImg = loadImage("assets/game over.png");
  resetImg = loadImage("assets/reset.png");
  winImg = loadImage("assets/YouWin.png");
  NewGameImg = loadImage("assets/New Game.png")


  winSound = loadSound("assets/win.mp3");
  loseSound = loadSound("assets/lose.mp3");
  ExplosionS = loadSound("assets/explosion.mp3");

  bgImg = loadImage("assets/bg.jpeg")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

//creating heart sprites
heart1 = createSprite(displayWidth-100,40,20,20);
 heart1.addImage(heart_1);
 heart1.scale = 0.3;
 heart1.visible=false;

 heart2 = createSprite(displayWidth-145,40,20,20);
 heart2.addImage(heart_2);
 heart2.scale = 0.3
 heart2.visible=false;

 heart3 = createSprite(displayWidth-200,40,20,20);
 heart3.addImage(heart_3);
 heart3.scale = 0.3
 heart3.visible=true;

 gameOver = createSprite(displayWidth/2,displayHeight/2-300);
 gameOver.addImage(gameOverImg);
 gameOver.scale=0.8;
 gameOver.visible=false;

 

 reset=createSprite(displayWidth/2,displayHeight/2-150);
 reset.addImage(resetImg);
 reset.scale=0.3;
 reset.visible=false; 

 win = createSprite(displayWidth/2,displayHeight/2-300);
 win.addImage(winImg);
 win.scale=0.8;
 win.visible=false;

 NewGame=createSprite(displayWidth/2,displayHeight/2-150);
 NewGame.addImage(NewGameImg);
 NewGame.scale=0.3;
 NewGame.visible=false; 

zombieGrp = new Group();
bulletGrp = new Group();

}

function draw() {
  background(0); 


  if(gameState=="play"){
     //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
 
  player.addImage(shooter_shooting);
  
  bullet = createSprite(player.x+55,player.y-23,10,10);
  bullet.addImage(bulletImg);
  bullet.velocityX=8;
  bullet.scale=0.2;
  bulletGrp.add(bullet);
  bullets=bullets-1;

  ExplosionS.play();
  player.depth=bullet.depth-1;
  
 
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

if(life==3){
  heart1.visible=false;
  heart2.visible=false;
  heart3.visible=true;
}
if(life==2){
  heart1.visible=false;
  heart2.visible=true;
  heart3.visible=false;
}
if(life==1){
  heart1.visible=true;
  heart2.visible=false;
  heart3.visible=false;
}
if(life==0){
  gameState="end";
}

if(score==2){
  gameState="win";
  winSound.play();
}

if(bullet==0){
  gameState="end";
  loseSound.play();
}

if(zombieGrp.isTouching(player)){
  life=life-1;
  loseSound.play();

  for(var i=0;i<zombieGrp.length;i++){
    if(zombieGrp[i].isTouching(player)){
      zombieGrp[i].destroy();
    }
  }
}

if(zombieGrp.isTouching(bulletGrp)){
  for(var i=0;i<zombieGrp.length;i++){
    if(zombieGrp[i].isTouching(bulletGrp)){
      zombieGrp[i].destroy();
      bulletGrp.destroyEach();
      score=score+1;
      ExplosionS.play();
    }
  }
}

spawnZombie();

  }

  if(gameState=="end"){
    gameOver.visible=true;
    reset.visible=true;
    zombieGrp.setLifetimeEach(-1);
    zombieGrp.setVelocityXEach(0);
    if(mousePressedOver(reset)){
      resetGame();
    }
  }

  if(gameState=="win"){
     win.visible=true;
     NewGame.visible=true;
     zombieGrp.setLifetimeEach(-1);
     zombieGrp.setVelocityXEach(0);
     if(mousePressedOver(NewGame)){
       resetGame();
     }     
  }

drawSprites();

textSize(20);
fill("white");
text("Bullets:"+bullets,displayWidth-500,displayHeight/2-400);

text("Score:"+score,displayWidth-600,displayHeight/2-400);

text("Life:"+life,displayWidth-700,displayHeight/2-400);

}

function spawnZombie(){
  if(frameCount%60==0){
    zombie = createSprite(random(displayWidth-100,displayWidth-600),random(displayHeight/2+200,displayHeight/3-100),50,50);
    zombie.addImage(ZombieImg);
    zombie.velocityX=-6;
    zombie.scale=0.15;
    zombie.lifetime=200;
    zombieGrp.add(zombie);
  }
}

function resetGame(){
  gameState="play";
  gameOver.visible=false;
  reset.visible=false;
  win.visible=false;
  NewGame.visible=false;
  score=0;
  life=3;
  bullets=100;
  zombieGrp.destroyEach();

}
