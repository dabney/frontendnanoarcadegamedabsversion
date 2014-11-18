// Some constants for reference
var CANVASWIDTH = 505;
var CANVASHEIGHT = 606;
var TILEROWS = 6;
var TILECOLS = 5;
var IMAGEWIDTH = 101;
var IMAGEHEIGHT = 171;
var SPEEDCONSTANT = 80;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
     this.x = Math.floor(Math.random() * CANVASWIDTH);
    this.y = Math.floor(Math.random() * CANVASHEIGHT);
    this.speedMultiplier = Math.random() * SPEEDCONSTANT;


 //   this.x = Math.floor(Math.random() * ctx.canvas.width);
 //   this.y = Math.floor(Math.random() * ctx.canvas.height);
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

  this.x = CANVASWIDTH/2 - IMAGEWIDTH/2;
 this.y = CANVASHEIGHT - IMAGEHEIGHT/2;

}

// Update the player's status
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
   //check for collision?

}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  //  console.log('this.sprite:' + this.sprite + ', ' + Resources.get(this.sprite));
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// handle keystroke input
Player.prototype.handleInput = function(direction) {
  //  console.log('this.sprite:' + this.sprite + ', ' + Resources.get(this.sprite));
    console.log('in handleInput: ' + direction);
    switch(direction) {
        case 'left':
                player.x = player.x - IMAGEWIDTH;
        break; 
        case 'right':
                       player.x = player.x - IMAGEWIDTH;
        break;
        case 'up':
                       player.y = player.y + IMAGEHEIGHT;
            break;
        case 'down':
                       player.y = player.y - IMAGEHEIGHT;
            break;
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
var allEnemies = createEnemies(3);
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
