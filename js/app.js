/**
 * @constant CANVASWIDTH the width of the game canvas
 */
var CANVASWIDTH = 505;
/**
 * @constant CANVASHEIGHT the height of the game canvas
 */
var CANVASHEIGHT = 606;
/**
 * @constant the number of rows of tiles in the game board
 */
var TILEROWS = 6;
/**
 * @constant the number of columns of tiles in the game board
 */
var TILECOLS = 5;
/**
 * @constant TILEWIDTH the width of the apparent horizontal surface of the isometric tiles used for the game
 */
var TILEWIDTH = 101;
/**
 * @constant TILEHEIGHT the height of the apparent horizontal surface of the isometric tiles used for the game
 */
var TILEHEIGHT = 83;
/**
 * @constant IMAGEWIDTH the width of the images used for the game
 */
var IMAGEWIDTH = 101;
/**
 * @constant IMAGEHEIGHT the height of the images used for the game
 */
var IMAGEHEIGHT = 171;
/**
 * @constant MINSPEED the min speed of the enemies; on enemy creation speed will be randomly set between MINSPEED and MAXSPEED
 */
var MINSPEED = 50;
/**
 * @constant MAXSPEED the max speed of the enemies; on enemy creation speed will be randomly set between MINSPEED and MAXSPEED
 */
var MAXSPEED = 350;
/**
 * @constant NUMENEMIES the number of enemies
 */
var NUMENEMIES = 5;
/**
 * @constant DELTAOPACITY tweak this to change how quickly the player disappears when she dies
 */
var DELTAOPACITY = .03;
/**
 * @constant COLLISIONSENSITIVITY tweak this to alter sensitivity of collision detection 
 */
var COLLISIONSENSITIVITY = 30;
/**
 * @constant NUMPLAYERLIVES the number of lives the player has before the game is over
 */
var NUMPLAYERLIVES = 3;
/**
 * @constant NUMTREASURES number of treasures to be displayed
 */
var NUMTREASURES = 5;
/**
 * @constant VALIDTREASUREPOSITIONS An array of possible positions for treasures
 *  (only includes stone path; top row is 0)
 */
var VALIDTREASUREPOSITIONS = [
  {row: 1,col:0}, {row: 1,col:1}, {row: 1,col:2}, {row: 1,col:3}, {row: 1,col:4},
  {row: 2,col:0}, {row: 2,col:1}, {row: 2,col:2}, {row: 2,col:3}, {row: 2,col:4},
  {row: 3,col:0}, {row: 3,col:1}, {row: 3,col:2}, {row: 3,col:3}, {row: 3,col:4}];

/**
 * @global gameOver a globally accessible variable to hold whether or not the game is over
 */
var gameOver = false;
/**
 * @global allEnemies a globally accessible array to hold the enemy objects
 */
var allEnemies = [];
/**
 * @global allTreasures a globally accessible array to hold the collectible treasure objects
 */
var allTreasures = [];
/**
 * @global player a globally accessible variable to hold the player object
 */
var player = null;

/** 
 * Class Enemy
 * The Enemy class is the template for the enemies.  It sets up an initial pseudorandom position
 *  and speedmultiplier and stores the current state of the enemies
 * @constructor
 */
var Enemy = function() {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = Math.floor(Math.random() * CANVASWIDTH); // set initial enemy x randomly within the width of the canvas
  this.y = (Math.floor(Math.random() * 3) + 1 )* TILEHEIGHT - 20; //set enemy y so it is ~centered in rows 1-3 (the stone rows)
  this.speedMultiplier = Math.random() * (MAXSPEED-MINSPEED) + MINSPEED; // set the enemy speed randomly from MINSPEED to MAXSPEED
};

/**
 * The update function for the Enemy class adjusts the x position based on the input, dt, delta time,
 * and the speed multiplier.  Resets x to -60 when x is greater than the canvas width
 * @param {number} dt This is the delta time
 * 
 */
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

/**
 * The render function for the Enemy class draws the enemy on the screen and its current x,y position
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/** 
 * Class Player
 * The Player class is the template for the player.  It sets up the initial state and stores
 * the current state of the player
 * @constructor
 */
var Player = function() {
// The image for our player character to be loaded using the Resources helper
  this.sprite = 'images/char-cat-girl.png';
  this.lifeIcon = 'images/Heart.png';
  this.numLives = NUMPLAYERLIVES;  // Set the initial lives to the NUMPLAYERLIVES constant
  this.numTreasures = 0;   // Set the number of treasurers collected to zero
  // Set initial position of player at bottom center tile
  this.x = CANVASWIDTH/2 - TILEWIDTH/2;
  this.y = CANVASHEIGHT - IMAGEHEIGHT - TILEHEIGHT/2;
  this.alive = true;   // Set initial state to be alive
  this.opacity = 1.0;   // Set initial opacity to fully opaque; opacity will be decreased when player dies
};

/**
 * The update function for the Player class calls a collision check or death sequence if the
 * game is not over.
 * @param {number} dt This is the delta time
 * 
 */
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

/**
 * The render function for the Player class draws the player, her remaining lives, and her score
 * or an appropriate message for the player if the game is over
 */
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
      ctx.fillText('YOU WON!!!', 53, CANVASHEIGHT/2);}
    else {
      ctx.fillText('GAME OVER', 53, CANVASHEIGHT/2);}
  }
  ctx.restore(); // restore context to previous state

}

/**
 * The handleInput function for the Player class handles keyboard input from the user
 * @param {string} direction The direction the user has input from the keyboard: 'left', 'right', 'up', 'down'
 */
Player.prototype.handleInput = function(direction) {
  var tmpX = this.x;
  var tmpY = this.y;
  // If the game is not over and the player is still alive, set potential new position bases on user input
  if (!gameOver && this.alive) {
    switch(direction) {
      case 'left':
        tmpX = this.x - TILEWIDTH;
      break; 
      case 'right':
        tmpX = this.x + TILEWIDTH;
      break;
      case 'up':
        tmpY = this.y - TILEHEIGHT;
      break;
      case 'down':
        tmpY = this.y + TILEHEIGHT;
      break;
    }
    // If player is not off edge of game canvas, set her new x,y
    if (!offCanvasEdge(tmpX, tmpY)) {
      this.x = tmpX;
      this.y = tmpY;
    }
  // Now, check to see if she collided with (captured) a treasure
  this.checkTreasureCollisions();
  }
}

/**
 * The checkEnemyCollisions function for the Player class checks to see if there is a collision
 * between the player and one of the enemies in the allEnemies array based on their positions and
 * the COLLISIONSENSITIVITY constant; if there has been a collision the number of lives is decremented
 * and the player is marked as dead
 */
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

/**
 * The checkTreasureCollisions function for the Player class checks to see if there is a collision
 * between the player and one of the treasures in the allTreasures array based on their positions and
 * the COLLISIONSENSITIVITY constant; if a collision is detected, the player's number of treasures is
 * incremented and the treasure's capture function is called.
 */
Player.prototype.checkTreasureCollisions = function() {
  var i;
  var currentTreasure;
  // loop through treasures; if collision then add a treasure to player and call treasure's captureMe function
  for (i = 0; i < NUMTREASURES; i++) {
    currentTreasure = allTreasures[i];
    if (!currentTreasure.captured) {
      if (collisionDetected(this.x, this.y, currentTreasure.x, currentTreasure.y, COLLISIONSENSITIVITY)) {
        this.numTreasures++;
        currentTreasure.captureMe();
      }
    }
  }
  // Check for game over condition: if player has captured all the treasures then game is over
  if (this.numTreasures === NUMTREASURES) {
    gameOver = true;
  }
}

/**
 * The deathSequence function for the Player class animates a death sequence by incrementally decreasing
 * sprite opacity to zero then calling a reset of the player if lives remain else ending the game
 */
Player.prototype.deathSequence = function() {
      player.opacity = player.opacity - DELTAOPACITY;
      // once player image is completely transparent then death sequence is done
      if (player.opacity <= 0) {
      // if player's lives are gone then it's game over
        if (this.numLives <= 0) {
          gameOver = true;
        }
        // if player still has lives left then reset her
        else {
          this.reset();
        }
      }
  }
  
/**
 * The reset function for the Player class resets the position, alive state, and opacity
 */
Player.prototype.reset = function() {
  // reset position of player to bottom center tile
  this.x = CANVASWIDTH/2 - TILEWIDTH/2;
  this.y = CANVASHEIGHT - IMAGEHEIGHT - TILEHEIGHT/2;
  this.alive = true;   // reset state to be alive
  this.opacity = 1.0;   // reset opacity to fully opaque; opacity will be decreased when player dies
}

/** 
 * Class Treasure
 * The Treasure class is the template for the treasures collected by the player. It sets up the initial
 *  state and stores the current state of the treasure
 * @constructor
 */
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
};

/**
 * The update function for the Treasure class would update the treasure based on dt, delta time,
 * of the game.
 * @param {number} dt This is the delta time
 */
Treasure.prototype.update = function(dt) {
    // nothing here yet; could be used to animate treasures
}

/**
 * The render function for the Treasure class draws the treasure if it is not already captured by the player
 */
Treasure.prototype.render = function() {
  if (!this.captured) {
     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

/**
 * The captureMe function for the Treasure class is called to set the state of the treasure to captured
 */
Treasure.prototype.captureMe = function() {
  // Set captured status to true
  this.captured = true;
}

/**
 * A utility function to determine if one of our images is off the game canvas
 * @param {number} x - The x position of the image
 * @param {number} y - The y position of the image
*/ 
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
};

/**
 * A utility function to detect if two points are within a certain distance of each other to 
 * determine if a collision has occurred.
 * @param {number} x1 - The x value of the first point
 * @param {number} y1 - The y value of the first point
 * @param {number} x2 - The x value of the second point
 * @param {number} y2 - The y value of the second point
 * @param {number} distance - The distance beneath which a collision should be triggered
*/ 
var collisionDetected = function(x1, y1, x2, y2, distance) {
  if (Math.abs(x1 - x2) < distance && Math.abs(y1 - y2) < distance) {
    return(true);
  }
  else {
    return(false);
  }
};

/**
 * A function to create our array of enemies
 * @param {number} numEnemies - The number of enemies to create
 */
var createEnemies = function(numEnemies) {
  var enemyArray = [];
  var tmpEnemy;
  var i;

  for (i=0; i < numEnemies; i++) {
    tmpEnemy = new Enemy();
    enemyArray.push(tmpEnemy);
  }
  return(enemyArray);
};

/**
 * A function to create our player
 */
var createPlayer = function() {
    var tmpPlayer = new Player;
    return(tmpPlayer);
};

/**
 * A function to create our array of treasures
 * @param {number} numTreasures - The number of treasures to create
 */
var createTreasures = function(numTreasures) {
  var treasureArray = [];
  var tmpTreasure;
  var i;

  for (i=0; i < numTreasures; i++) {
    tmpTreasure = new Treasure();
    treasureArray.push(tmpTreasure);
  }
  return(treasureArray);
};

/**
 * A function to do the initial set up of our game entities
 */
var entitySetup = function() {
  allEnemies = createEnemies(NUMENEMIES);
  allTreasures = createTreasures(NUMTREASURES);
  player = createPlayer();
};

/**
 * Call the initial setup of all our game entities
 */
entitySetup();

/**
 * Add an event listener to listen for key presses and send the keys to Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
