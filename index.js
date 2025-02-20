let canva = document.querySelector("#canva");
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
  x : birdX,
  y : birdY,
  width : birdWidth,
  height : birdHeight
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let bestScore = 0;
let gameSong = new Audio("assets/sounds/Super Mario Bros. Theme Song(MP3_320K).mp3")
let gameSongStarted = false;

window.onload=()=>{
  canva.height = boardHeight;
  canva.width = boardWidth;
  context = canva.getContext("2d");
  
  birdImg = new Image();
  birdImg.src = "images/flappybird.png";
  birdImg.onload = ()=>{
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

  }
  topPipeImg = new Image();
  topPipeImg.src="images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src="images/bottompipe.png"

  
  requestAnimationFrame(update)
  setInterval(drawPipe,1500);
  document.addEventListener("keypress",moveBird);
}

const update = ()=>{
  requestAnimationFrame(update)
  if(gameOver){
    gameSong.pause();
    return;
  }
  context.clearRect(0,0,canva.width,canva.height);
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY,0)
  context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
  if(bird.y > canva.height){
    gameOver = true;
  }

  for(let i = 0; i < pipeArray.length;i++){
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
    if(!pipe.passed && bird.x > pipe.x +pipe.width){
      
      score += 1/2;
      bestScore = Math.max(bestScore,score);
      pipe.passed = true;
    }

    if (collision(bird,pipe)){
      gameOver = true;
    }
  }
  while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
    pipeArray.shift();
  }
  context.fillStyle = "white";
  context.font = "20px Bungee Spice, sans-serif"
  context.fillText(`Score: ${score}`,5,45);
  context.fillText(`Best Score: ${bestScore}`,195,45);
  
  if(gameOver){
    context.font = "45px Bungee Spice, sans-serif"
    context.fillText("Game Over",50,200)
    context.font = "20px Bungee Spice, sans-serif"
    context.fillText("Press SpaceBar to Play",50,500)
    context.font = "25px Bungee Spice, sans-serif"
    context.fillText(`Score: ${score}`,4,350)
    context.fillText(`Best Score: ${bestScore}`,160,350)
    const gameOver = new Audio("assets/sounds/Mario Death - Sound Effect (HD)(MP3_320K).mp3")
    gameOver.play();
  }
}

const drawPipe = ()=>{
  if (gameOver){
    return;
  }
  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)
  let openingSpace = canva.height/4;

  let topPipe = {
    img : topPipeImg,
    x : pipeX,
    y : randomPipeY,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  }
  pipeArray.push(topPipe)

  let bottomPipe = {
    img : bottomPipeImg,
    x: pipeX,
    y : randomPipeY + pipeHeight + openingSpace,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  };
  pipeArray.push(bottomPipe);
}

const moveBird = (e)=>{
  if(e.code === "Space"){
    if(!gameSongStarted){
      gameSong.loop = true;
      gameSong.play();
      gameSongStarted = true;
    }
    velocityY = -6
  }

  if(gameOver){
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    gameSong.currentTime = 0;
    gameSong.play();
    
  }
}

const collision = (a,b)=>{
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
