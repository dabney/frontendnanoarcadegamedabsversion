// Some constants for reference
var CANVASWIDTH = 505;
var CANVASHEIGHT = 606;
var TILEROWS = 6;
var TILECOLS = 5;
var TILEWIDTH = 101;
var TILEHEIGHT = 83;
var IMAGEWIDTH = 101;
var IMAGEHEIGHT = 171;
var MAXSPEED = 150;
var NUMENEMIES = 3;
var DELTATRANSPARENCY = .01;
var COLLISIONSENSITIVITY = 50;
var NUMPLAYERLIVES = 3;

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
     this.x = Math.floor(Math.random() * CANVASWIDTH); // set enemy x randomly within the width of the canvas
    this.y = (Math.floor(Math.random() * 3) + 1 )* TILEHEIGHT - 20; //set enemy y randomly to center of one of stone rows
    this.speedMultiplier = Math.random() * MAXSPEED; // set the enemy speed randomly from 0 to MAXSPEED
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + dt * this.speedMultiplier;
    if (this.x > ctx.canvas.width) {
        this.x = 10;
    }

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player class
var Player = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-cat-girl.png';
  this.x = CANVASWIDTH/2 - TILEWIDTH/2;
 this.y = CANVASHEIGHT - IMAGEHEIGHT - TILEHEIGHT/2;
 this.alive = true;
 this.transparency = 1.0;
 this.numlives = NUMPLAYERLIVES;

}

// Update the player's status
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
   //check for collision?
       var i;

       for (i = 0; i < NUMENEMIES; i++) {
        if (this.alive) {
    if (collisionDetected(this.x, this.y, allEnemies[i].x, allEnemies[i].y, COLLISIONSENSITIVITY)) {
   //     console.log('setting player.alive to false');
      this.numlives--;
      if (this.numlives === 0) {}
    this.alive = false;
}}
    }

    if (!player.alive) {
        player.transparency = player.transparency - DELTATRANSPARENCY;
        if (player.transparency <= 0) {
            this.alive = true;
            this.transparency = 1;
  this.x = CANVASWIDTH/2 - TILEWIDTH/2;
 this.y = CANVASHEIGHT - IMAGEHEIGHT - TILEHEIGHT/2;
        }
    //    console.log('player.transparency: ' + player.transparency);

    }


}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  //  console.log('this.sprite:' + this.sprite + ', ' + Resources.get(this.sprite));
      for (var i=0; i < this.numlives; i++) {
        ctx.drawImage(Resources.get('images/Heart.png'), 10 + i*45, 50, 34, 57);
    }
  if (this.alive) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        //    console.log('this.numlives', this.numlives);



}
  else {
   ctx.save()
    ctx.globalAlpha = player.transparency;
  //  ctx.translate(this.x, this.y);
   // ctx.translate(IMAGEWIDTH/2, IMAGEHEIGHT);

   // ctx.rotate(Math.PI/(2*player.transparency));
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
   ctx.restore();

  }
}

// handle keystroke input
Player.prototype.handleInput = function(direction) {
    var tmpX;
    var tmpY;

    if (this.alive) {
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
}
}

// Treasures our player can collect
var Treasure = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Star.png';
     this.x = Math.floor(Math.random() * CANVASWIDTH); // set enemy x randomly within the width of the canvas
    this.y = (Math.floor(Math.random() * 3) + 1 )* TILEHEIGHT - 20; //set enemy y randomly to center of one of stone rows
    this.speedMultiplier = Math.random() * MAXSPEED; // set the enemy speed randomly from 0 to MAXSPEED
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Treasure.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + dt * this.speedMultiplier;
    if (this.x > ctx.canvas.width) {
        this.x = 10;
    }

}

// Draw the enemy on the screen, required method for game
Treasure.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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

var allEnemies = createEnemies(3);
var allTreasures = createTreasures(3);

var player = createPlayer();

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
