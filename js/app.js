// Some constants for reference
var CANVASWIDTH = 505;
var CANVASHEIGHT = 606;
var TILEROWS = 6;
var TILECOLS = 5;
var TILEWIDTH = 101;
var TILEHEIGHT = 83;
var IMAGEWIDTH = 101;
var IMAGEHEIGHT = 171;
var MINSPEED = 50;
var MAXSPEED = 350;
var NUMENEMIES = 5;
var DELTAOPACITY = .03;
var COLLISIONSENSITIVITY = 50;
var NUMPLAYERLIVES = 3;
var NUMTREASURES = 5;
// An array of possible positions for treasures (only includes stone path; top row is 0)
var VALIDTREASUREPOSITIONS = [
  {row: 1,col:0}, {row: 1,col:1}, {row: 1,col:2}, {row: 1,col:3}, {row: 1,col:4},
  {row: 2,col:0}, {row: 2,col:1}, {row: 2,col:2}, {row: 2,col:3}, {row: 2,col:4},
  {row: 3,col:0}, {row: 3,col:1}, {row: 3,col:2}, {row: 3,col:3}, {row: 3,col:4}];

// Some globally accessible variables for our game state and game entities
var gameOver = false;
var allEnemies = [];
var allTreasures = [];
var player = null;


// Enemies our player must avoid
var Enemy = function() {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = Math.floor(Math.random() * CANVASWIDTH); // set initial enemy x randomly within the width of the canvas
  this.y = (Math.floor(Math.random() * 3) + 1 )* TILEHEIGHT - 20; //set enemy y so it is ~centered in rows 1-3 (the stone rows)
  this.speedMultiplier = Math.random() * (MAXSPEED-MINSPEED) + MINSPEED; // set the enemy speed randomly from MINSPEED to MAXSPEED
}

// Update the enemy's position based on dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (!gameOver) {
    // update the enemy x value for each tick based on his speed
    this.x = this.x + dt * this.speedMultiplier;
    // if the enemy goes off the canvas to the right, reset his x value so he returns from the left
    if (this.x > ctx.canvas.width) {
      this.x = -60;
    }
  }
}

// Draw the enemy on the screen at his current x,y position
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player class
var Player = function() {
// The image for our player character to be loaded using the Resources helper
  this.sprite = 'images/char-cat-girl.png';
  this.lifeIcon = 'images/Heart.png';
  this.numLives = NUMPLAYERLIVES;  // Set the initial lives to the NUMPLAYERLIVES constant
  this.numTreasures = 0;   // Set the number of treasurers collected to zero
  this.reset();  // set default position, opacity, alive state
}

// Update the player's status
Player.prototype.update = function(dt) {
  var i;
  if (!gameOver) {
  // if player is still alive check for collisions with enemies
    if (this.alive) {
      this.checkEnemyCollisions();
    }
  // if player is not alive, start decreasing the player's opacity to create a fading away animation
    else {
        this.deathSequence();
    }
  }
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  // Draw player's life icon for remaining player's lives in the upper left corner 
  for (var i=0; i < this.numLives; i++) {
    ctx.drawImage(Resources.get(this.lifeIcon), 10 + i*45, 50, 34, 57);
  }
  // Display the player's score in the upper right corner
  ctx.fillText('Score ' + this.numTreasures, CANVASWIDTH - 95, 80);
  ctx.save(); // save the context so we can restore after making our changes
  ctx.globalAlpha = this.opacity; // set alpha to current player's opacity for death sequence
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y); // Draw the player's sprite at her current x,y
  // If the game is over display appropriate message
  if (gameOver) {
    ctx.font = "48pt Arial";
    if (this.numTreasures === NUMTREASURES) {
      ctx.fillText('YOU WON!!!', 39, 200);}
    else {
      ctx.fillText('GAME OVER', 39, 200);}
  }
  ctx.restore(); // restore context to previous state

}

// handle keystroke input
Player.prototype.handleInput = function(direction) {
  var tmpX;
  var tmpY;
  // If the game is not over and the player is not dead, set potential new position bases on user input
  if (!gameOver || !player.alive) {
    switch(direction) {
      case 'left':
        tmpX = this.x - TILEWIDTH;
        tmpY = this.y;
      break; 
      case 'right':
        tmpX = this.x + TILEWIDTH;
        tmpY = this.y;
      break;
      case 'up':
        tmpX = this.x;
        tmpY = this.y - TILEHEIGHT;
      break;
      case 'down':
        tmpX = this.x;
        tmpY = this.y + TILEHEIGHT;
      break;
    }
    // If player is not off edge of game canvas, set her new x,y
    if (!offCanvasEdge(tmpX, tmpY)) {
      this.x = tmpX;
      this.y = tmpY;
    }
  // Now, check to see if she collided with (grabbed) a treasure
  this.checkTreasureCollisions();
  }
}

Player.prototype.checkEnemyCollisions = function() {
  var i;
  // loop through enemies; if collision then subtract a life and kill the player
  for (i = 0; i < NUMENEMIES; i++) {
    if (collisionDetected(this.x, this.y, allEnemies[i].x, allEnemies[i].y, COLLISIONSENSITIVITY)) {
      this.numLives--;
      this.alive = false;
    }
  }
}

Player.prototype.checkTreasureCollisions = function() {
  var i;
  // loop through treasures; if collision then add a treasure to player and call treasure's capture function
  for (i = 0; i < NUMTREASURES; i++) {
    if (collisionDetected(this.x, this.y, allTreasures[i].x, allTreasures[i].y, COLLISIONSENSITIVITY)) {
      this.numTreasures++;
      allTreasures[i].capture();
      // If player has captured all the treasures then game is over
      if (this.numTreasures === NUMTREASURES) {
            gameOver = true;
      }
    }
  }
}

// Death sequence - incrementally decrease player sprite opacity to zero, if all lives gone then game is over
// If lives remain then reset player so remaining lives can be used
Player.prototype.deathSequence = function() {
      player.opacity = player.opacity - DELTAOPACITY;
      // once player image is completely transparent then death sequence is done
      if (player.opacity <= 0) {
      // if player's lives are gone then it's game over
        if (this.numLives === 0) {
          gameOver = true;
        }
        // if player still has lives left then reset her
        else {
          this.reset();
        }
      }
  }

Player.prototype.reset = function() {
  // Set initial position of player at bottom center tile
  this.x = CANVASWIDTH/2 - TILEWIDTH/2;
  this.y = CANVASHEIGHT - IMAGEHEIGHT - TILEHEIGHT/2;
  this.alive = true;   // Set initial state to be alive
  this.opacity = 1.0;   // Set initial opacity to fully opaque; opacity will be decreased when player dies
  }

// Treasures our player can collect
var Treasure = function() {
  var randomPositionIndex;

  this.sprite = 'images/Star.png'; // Set the image/sprite for our treasures
  this.captured = false; // This will be set to true if player captures treasure
  // get a random index into the valid positions array
  randomPositionIndex = Math.floor(Math.random() * VALIDTREASUREPOSITIONS.length);
  // set x to the beginning of the column of our randomly grabbed position
  this.x = VALIDTREASUREPOSITIONS[randomPositionIndex].col * TILEWIDTH;
  // set y to the value beginning of the column of our randomly grabbed position, adjust to center
  this.y = VALIDTREASUREPOSITIONS[randomPositionIndex].row * TILEHEIGHT - 12;
  // remove the current position so it will not be re-used (should be saved if full game reset enabled)
  VALIDTREASUREPOSITIONS.splice(randomPositionIndex, 1);
}

Treasure.prototype.update = function(dt) {
    // nothing here yet; could be used to animate treasures
}

// If treasure is not captured, draw it on the screen at its current x,y
Treasure.prototype.render = function() {
  if (!this.captured) {
     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

// Called when player captures treasure
Treasure.prototype.capture = function() {
  // Set captured status to true
  this.captured = true;
}

// A utility function to determine if one of our images is off the game canvas
var offCanvasEdge = function(x, y) {
  if (x < 0 || x + IMAGEWIDTH > CANVASWIDTH) {
    return(true);
  }
  else if (y < 0 || y + IMAGEHEIGHT > CANVASHEIGHT) {
    return(true);
  }
  else {
    return(false);
  }
}

// A utility function to detect if two points are within a certain distance of each other
var collisionDetected = function(x1, y1, x2, y2, distance) {
  if (Math.abs(x1 - x2) < distance && Math.abs(y1 - y2) < distance) {
    return(true);
  }
  else {
    return(false);
  }
}

// A function to create our array of enemies
var createEnemies = function(numEnemies) {
  var enemyArray = [];
  var tmpEnemy;
  var i;

  for (i=0; i < numEnemies; i++) {
    tmpEnemy = new Enemy();
    enemyArray.push(tmpEnemy);
  }
  return(enemyArray);
}

// a function to create our player
var createPlayer = function() {
    var tmpPlayer = new Player;
    return(tmpPlayer);
}

// a function to create our array of treasures
var createTreasures = function(numTreasures) {
  var treasureArray = [];
  var tmpTreasure;
  var i;

  for (i=0; i < numTreasures; i++) {
    tmpTreasure = new Treasure();
    treasureArray.push(tmpTreasure);
  }
  return(treasureArray);
}

// A function to do the initial set up of our game entities
var entitySetup = function() {
  allEnemies = createEnemies(NUMENEMIES);
  allTreasures = createTreasures(NUMTREASURES);
  player = createPlayer();
}

// Call the initial setup of all our game entities
entitySetup();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
