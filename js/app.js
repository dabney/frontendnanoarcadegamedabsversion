// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
     this.x = Math.floor(Math.random() * 500);
    this.y = Math.floor(Math.random() * 330);
    this.speedMultiplier = Math.random() * 70;

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
//    console.log('Engine: ' + Engine);
 //   console.log('ctx: ' + ctx);
//        console.log('ctx.canvas.width: ' + ctx.canvas.width);


    //this.y = this.y + dt*10;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  //  console.log('this.sprite:' + this.sprite + ', ' + Resources.get(this.sprite));
   //     console.log('tmpEnemy:' + tmpEnemy.sprite + ', ' + Resources.get(tmpEnemy.sprite));


    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player class
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-cat-girl.png';
         this.x = 10;
    this.y = 10;
  //   this.x = ctx.canvas.width/2 - 50;
  //  this.y = ctx.canvas.height - 171;

 //   this.x = Math.floor(Math.random() * ctx.canvas.width);
 //   this.y = Math.floor(Math.random() * ctx.canvas.height);
}

// Update the player's status
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
   //check for collision?
//    console.log('Engine: ' + Engine);
 //   console.log('ctx: ' + ctx);
//        console.log('ctx.canvas.width: ' + ctx.canvas.width);


    //this.y = this.y + dt*10;
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  //  console.log('this.sprite:' + this.sprite + ', ' + Resources.get(this.sprite));



    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
createEnemies = function(numEnemies) {
  var enemyArray = [];
  var tmpEnemy;
  var i;

  for (i=0; i < numEnemies; i++) {
console.log('numEnemies: ' + numEnemies);
      tmpEnemy = new Enemy();
      enemyArray.push(tmpEnemy);

console.log('Enemy: ' + tmpEnemy);
console.log('tmpEnemy x: ' + tmpEnemy.x);
  }
  return(enemyArray);

}
var allEnemies = createEnemies(5);
var player = new Player();



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
