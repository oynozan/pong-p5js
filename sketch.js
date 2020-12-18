//Prepare the game
let startGameBool = false;
let difficulty;
function startGame(d) {
  startGameBool = true;
  difficulty = d;
  //Remove button elements
  var el = document.querySelector('.buttons');
  el.parentNode.removeChild(el);
}

//----------------//

let startX, startY; //Start position of ball
let radius = 15; //Ball radius
let started = false; //Check if game has started

let controllerH = 100; //Height of controller
let opponentStepY = 0; //Make opponent movable
let controllerY; //Y position of controller

let x, y; //Ball x,y position
let stepX = 0,
  stepY = 0; //Make ball movable

//Variables for detect direction of ball
let horizonRight = false,
  verticalBottom = true;

let randomX = Math.floor(Math.random() * 5) + 4,
  randomY = Math.floor(Math.random() * 5) + 2;

let opponentX; //X position of opponent
let opponentY; //Y position of opponent

let playerScore = 0,
  opponentScore = 0; //Scores

let collidePlayer, collideOpponent; //Check for collide

//Game difficulty
let easy = 10;
let medium = 15;
let hard = 20;
let expert = 30;
let mode = easy;

switch(difficulty) {
  case "easy":
    mode = easy;
    break;
  case "medium":
    mode = medium;
    break;
  case "hard":
    mode = hard;
    break;
  case "expert":
    mode = expert;
    break;
}

//Opponent Velocity
let opponentVelocity = 4;
switch(mode) {
  case easy:
    opponentVelocity = 4;
    break;
  case medium:
    opponentVelocity = 4.5;
    break;
  case hard:
    opponentVelocity = 5;
    break;
  case expert:
    opponentVelocity = 6;
    break;
}

function setup() {
    createCanvas(600, 400);
    //Setting Start Points of Ball
    startX = width / 2;
    startY = height / 2;
    opponentX = width - 40;
}

function draw() {
  if (startGameBool) {
    background(0);

    //Set the values position of ball
    x = startX + stepX;
    y = startY + stepY;

    //Collide Check
    collideCheck(x, y, radius);

    //Drawing Ball
    circle(x, y, radius);

    if (!started) {
      //Start Text
      fill(255);
      textSize(25);
      text("Press Space to Start!", 180, height / 2 + 50);

      //Score Text
      textSize(34);
      text(playerScore, 60, 70); //Player
      text(opponentScore, width - 80, 70); //Opponent

      //Start position of controller
      noStroke()
      controller(30, height / 2 - controllerH / 2, 10, controllerH);

      //Start position of opponent
      opponent(opponentX, height / 2 - controllerH / 2, 10, controllerH);

    } else {
      //When Game has Started:

      //Ball Collide Statement
      if (horizonRight) {
        stepX += randomX; //Go Right
      } else if (!horizonRight) {
        stepX -= randomX; //Go Left
      }
      if (verticalBottom) {
        stepY += randomY; //Go Bottom
      } else if (!verticalBottom) {
        stepY -= randomY; //Go Top
      }

      //Update Controller using Y position of mouse
      controllerY = constrain(mouseY - controllerH / 2, 0, height - controllerH)
      controller(30, controllerY, 10, controllerH);

      //Update opponent using Y position of ball
      opponent(opponentX, height / 2 - controllerH / 2, 10, controllerH, y);

    }
  }
}

function changeX(value) {
  //Randomly change Y direction of ball
  if (Math.floor(Math.random() * 3) == 1) verticalBottom = !verticalBottom;
  //Change X direction
  horizonRight = value; //Go to direction that "value" defines
  //Re-creating velocity values
  randomX = Math.floor(Math.random() * randomX * 2) + 4;
  randomY = Math.floor(Math.random() * 5) + 2;
}

function collideCheck(x, y, r) {

  //Collide Check for X
  collidePlayer = collideRectCircle(30, controllerY, 10, controllerH, x, y, r);
  collideOpponent = collideRectCircle(opponentX, opponentY, 10, controllerH, x, y, r);

  //Game Over
  if (x + r / 2 >= width) {
    gameOver("You");
  } else if (x - r / 2 <= 0) {
    gameOver("Opponent");
  }

  //-----Y-----//
  else if (y + r / 2 >= height) {
    verticalBottom = false; //Collide with bottom wall
  } else if (y - r / 2 <= 0) {
    verticalBottom = true; //Collide with top wall
  }

  //P5JS COLLIDE LIB
  else if (collidePlayer) {
    changeX(true);
  } else if (collideOpponent) {
    changeX(false);
  }
  if (randomX > 16) randomX = 16;
}

//------!Player!------//
function controller(x, y, hx, hy) {
  rect(x, y, hx, hy);
}

//------!Opponent!------//
function opponent(x, y, hx, hy, ballY = false) {
  //Opponent Move Statement
  if (ballY) { //If game has started
    if (ballY > y + opponentStepY + hy / 2 - mode) { //Go up if ball is higher than opponent
      opponentStepY += opponentVelocity;
    } else if (ballY < y + opponentStepY + hy / 2 - mode) { //Go down if ball is lower than opponent
      opponentStepY -= opponentVelocity;
    }
  }
  opponentY = y + opponentStepY;
  rect(x, constrain(opponentY, 0, height - hy), hx, hy);
}

function gameOver(win) {
  started = false;
  if (win == "You") {
    playerScore++; //Increase player's score
  } else {
    opponentScore++; //Increase opponent's score
  }
  resetGame();
}

function resetGame() {
  //Write start text
  textSize(25);
  text("Press Space to Start!", 180, height / 2 + 50);
  //Reset all the variables
  x = width / 2;
  y = height / 2;
  stepX = 0;
  stepY = 0;
  opponentStepY = 0;
  horizonRight = false;
  randomX = Math.floor(Math.random() * 5) + 4;
  randomY = Math.floor(Math.random() * 5) + 2;
}

//Key Control
function keyPressed() {
  if (keyCode == 32) {
    started = true; //If space has pressed, start the game
  }
}