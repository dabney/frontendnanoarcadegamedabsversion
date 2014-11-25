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
  // Set initial position of player at bottom center tile
  this.x = CANVASWIDTH/2 - TILEWIDTH/2;
  this.y = CANVASHEIGHT - IMAGEHEIGHT - TILEHEIGHT/2;
  // Set initial state to be alive
  this.alive = true;
  // Set initial opacity to fully opaque; opacity will be decreased when player dies
  this.opacity = 1.0;
  // Set the initial lives to the NUMPLAYERLIVES constant
  this.numLives = NUMPLAYERLIVES;
  // Set the number of treasurers collected to zero
  this.numTreasures = 0;
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
    for (var i=0; i < this.numLives; i++) {
        ctx.drawImage(Resources.get('images/Heart.png'), 10 + i*45, 50, 34, 57);
    }
   ctx.save()
    ctx.globalAlpha = player.opacity;
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
                 if (gameOver) {
        ctx.font = "48pt Arial";
              if (this.numTreasures === NUMTREASURES) {
        ctx.fillText('YOU WON!!!', 36, 200);}
        else {
        ctx.fillText('GAME OVER', 36, 200);}
    }


   ctx.restore();


  ctx.fillText('Score ' + this.numTreasures, CANVASWIDTH - 100, 80);

}

// handle keystroke input
Player.prototype.handleInput = function(direction) {
    var tmpX;
    var tmpY;
    if (!gameOver || !player.alive) {
  //  console.log('this.sprite:' + this.sprite + ', ' + Resources.get(this.sprite));
    switch(direction) {
        case 'left':
                tmpX = this.x - TILEWIDTH;
                if (!offCanvasEdge(tmpX, this.y)) {
                    this.x = tmpX;
                }
        break; 
        case 'right':
                       tmpX = this.x + TILEWIDTH;
                if (!offCanvasEdge(tmpX, this.y)) {
                    this.x = tmpX;
                }
        break;
        case 'up':
                       tmpY = this.y - TILEHEIGHT;
                if (!offCanvasEdge(this.x, tmpY)) {
                    this.y = tmpY;
                }
            break;
        case 'down':
                       tmpY = this.y + TILEHEIGHT;
                if (!offCanvasEdge(this.x, tmpY)) {
                    this.y = tmpY;
                }
            break;
    }
    this.checkTreasureCollisions();
}
}

Player.prototype.checkEnemyCollisions = function() {
    var i;
  for (i = 0; i < NUMENEMIES; i++) {
        if (collisionDetected(this.x, this.y, allEnemies[i].x, allEnemies[i].y, COLLISIONSENSITIVITY)) {
          this.numLives--;
          this.alive = false;
        }
      }
}

Player.prototype.checkTreasureCollisions = function() {
     for (i = 0; i < NUMTREASURES; i++) {
        if (collisionDetected(this.x, this.y, allTreasures[i].x, allTreasures[i].y, COLLISIONSENSITIVITY)) {
          this.numTreasures++;
          allTreasures[i].capture();
          if (this.numTreasures === NUMTREASURES) {
            gameOver = true;
          }
        }
      }
    }

Player.prototype.deathSequence = function() {
      player.opacity = player.opacity - DELTAOPACITY;
      // once player image is completely transparent
      if (player.opacity <= 0) {
      // if player's lives are gone then it's game over
        if (this.numLives === 0) {
          gameOver = true;
        }
        // if player still has lives left then reset him
        else {
          this.resurrect();
        }
      }
  }

Player.prototype.resurrect = function() {
          this.alive = true;
          this.opacity = 1;
          this.x = CANVASWIDTH/2 - TILEWIDTH/2;
          this.y = CANVASHEIGHT - IMAGEHEIGHT - TILEHEIGHT/2;
      }

// Treasures our player can collect
var Treasure = function() {
    var randomPositionIndex = Math.floor(Math.random() * VALIDTREASUREPOSITIONS.length);
    console.log('random index: ' + randomPositionIndex);
    // The image/sprite for our treasures, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Star.png';
    console.log('random treasure position: ' + VALIDTREASUREPOSITIONS[randomPositionIndex].row + ', ' + VALIDTREASUREPOSITIONS[randomPositionIndex].col);
     this.x = VALIDTREASUREPOSITIONS[randomPositionIndex].col * TILEWIDTH; // set treasuer x randomly within the width of the canvas
    this.y = VALIDTREASUREPOSITIONS[randomPositionIndex].row * TILEHEIGHT - 12; //set treasure y randomly to center of one of stone rows
VALIDTREASUREPOSITIONS.splice(randomPositionIndex, 1);
this.captured = false;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Treasure.prototype.update = function(dt) {

}

// Draw the enemy on the screen, required method for game
Treasure.prototype.render = function() {
    if (!this.captured) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

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

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Treasure.prototype.capture = function() {
    this.captured = true;
    this.x = -100;
    this.y = -100;

}
var collisionDetected = function(x1, y1, x2, y2, distance) {
 //   console.log('checking for collision', Math.abs(x1-x2), Math.abs(y1-y2));
    if (Math.abs(x1 - x2) < distance && Math.abs(y1 - y2) < distance) {
      //  console.log('collision detected');
        return(true);
    }
    else {
        return(false);
    }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
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

var createPlayer = function() {
    var tmpPlayer = new Player;
    return(tmpPlayer);
}

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

var gameSetup = function() {
allEnemies = createEnemies(NUMENEMIES);
allTreasures = createTreasures(NUMTREASURES);
player = createPlayer();
}

gameSetup();



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
