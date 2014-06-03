var Alienship = function Alienship(canvas) {
   Sprites.draw(canvas,'alienship',10,10);
}

var AlienFlock = function AlienFlock() {
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;
  this.speed = 10;

  this.draw = function() {};

  this.die = function() {
    if(Game.board.nextLevel()) {
      Game.loadBoard(new GameBoard(Game.board.nextLevel())); 
    } else {
      Game.callbacks['win']();
    }
  }

  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy=0;
    }
    this.dx = this.speed * this.hit;

    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Alien)  {
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0) { this.die(); } 

    this.max_y = max;
    return true;
  };

}



var Alien = function Alien(opts) {
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;
}

Alien.prototype.draw = function(canvas) {
  Sprites.draw(canvas,this.name,this.x,this.y,this.frame);
}

//Alien dying function
Alien.prototype.die = function() {
//  Increase score
  Score(1);
  Feeling();
//  Play explosion sound
  GameAudio.play('die');
//  Increase speed of aliens when one is killed
  this.flock.speed += 1;
  this.board.remove(this);
}

Alien.prototype.step = function(dt) {
  this.mx += dt * this.flock.dx;
  this.y += this.flock.dy;
       
  if(Math.abs(this.mx) > 10) {
    if(this.y == this.flock.max_y[this.x]) {
      this.fireSometimes();
    }
    this.x += this.mx;
    this.mx = 0;
    this.frame = (this.frame+1) % 2;
    GameAudio.play('blip');
    if(this.x > Game.width - Sprites.map.alien1.w * 2) this.flock.hit = -1;
    if(this.x < Sprites.map.alien1.w) this.flock.hit = 1;
  }
    if(this.y > 470) {
        GameAudio.play('die');
        Game.callbacks['die']();
    }
  return true;
}

//Defines how often aliens should fire
Alien.prototype.fireSometimes = function() {
      if(Math.random()*100 < 10) {
        this.board.addSprite('missile2',this.x + this.w/2 - Sprites.map.missile2.w/2,
                                      this.y + this.h, 
                                     { dy: 100 });
      }
}

var Player = function Player(opts) { 
  this.reloading = 0;
}

Player.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'player',this.x,this.y);
}


Player.prototype.die = function() {
  GameAudio.play('die');
  Game.callbacks['die']();
}

//Player spaceship controls
Player.prototype.step = function(dt) {
  if(Game.keys['left']) { this.x -= 100 * dt; }
  if(Game.keys['right']) { this.x += 100 * dt; }

  if(this.x < 0) this.x = 0;
  if(this.x > Game.width-this.w) this.x = Game.width-this.w;

  this.reloading--;

//Maximum number of missiles, missile speed and reload delay
  if(Game.keys['fire'] && this.reloading <= 0 && this.board.missiles < 3) {
    GameAudio.play('fire');
    this.board.addSprite('missile',
                          this.x + this.w/2 - Sprites.map.missile.w/2,
                          this.y-this.h,
                          { dy: -100, player: true });
    this.board.missiles++;
    this.reloading = 10;
  }
  return true;
}

//The function for the player missile
var Missile = function Missile(opts) {
   this.dy = opts.dy;
   this.player = opts.player;
}

Missile.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'missile',this.x,this.y);
}

Missile.prototype.step = function(dt) {
   this.y += this.dy * dt-10; //Speed of player missile

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}

Missile.prototype.die = function() {
  if(this.player) this.board.missiles--;
  if(this.board.missiles < 0) this.board.missiles=0;
   this.board.remove(this);
}

//The function for the alien animated missile
var Missile2 = function Missile2(opts) {
   this.dy = opts.dy;
   this.player = opts.player;
   this.frame = 0;
}

Missile2.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'missile2',this.x,this.y,this.frame);
}

Missile2.prototype.step = function(dt) {
   this.y += this.dy * dt;
   this.frame = (this.frame+1) % 2;

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}

Missile2.prototype.die = function() {
  if(this.player) this.board.missiles2--;
  if(this.board.missiles2 < 0) this.board.missiles2=0;
   this.board.remove(this);
}

//Red alien spaceship function based on code from https://github.com/efesop/Space-Invaders
var Alienship = function Alienship(opts) {
  this.dx = opts.dx;
  this.frame = 0;
}

Alienship.prototype.draw = function(canvas) {
  Sprites.draw(canvas,'alienship',this.x,this.y,this.frame);
}

Alienship.prototype.step = function(dt) {
  this.x += this.dx;
  this.frame = (this.frame+1) % 3; //Animate 3 frames
  if (this.x < 500) { //stops the alienship sound when it goes offscreen and wasn't shot
      GameAudio.play('alienship');
  }
  return true;
}

Alienship.prototype.die = function() {
  Score(10); //Red alien ship is worth 10 points
  Feeling();
  GameAudio.play('die');
  this.board.remove(this);
}

//Update score fuction
var Score = function Score(x) {
  score = score + x;
  var scorediv = document.getElementById("scoreboard");
  var scorectx = scorediv.getContext("2d");
  scorectx.fillStyle = "#000000";
  scorectx.fillRect(0,0,500,25);
  scorectx.fillStyle = "#FFFFFF";
  scorectx.font = "15px retroville";
  scorectx.textAlign = "center";
  scorectx.fillText("Aliens with feelings needlessly murdered: "+score,250,18);
}

//Display random feeling function
var Feeling = function Feeling() {
  var randomFeeling = feelings[Math.floor(Math.random()*feelings.length)];
//  Display random feeling and redraw background
  var c = document.getElementById("feelingsboard");
  var ctx = c.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0,0,500,100);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "15px retroville";
  wrapText(ctx,randomFeeling,253,18,500,15);
}