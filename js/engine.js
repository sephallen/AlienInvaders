//Define keyboard buttons with keycodes
var Game = new function() {                                                                  
  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire', 13:'enter' };
  this.keys = {};

//Initialise canvas
  this.initialize = function(canvas_dom,level_data,sprite_data,callbacks) {
    this.canvas_elem = $(canvas_dom)[0];
    this.canvas = this.canvas_elem.getContext('2d');
    this.width = $(this.canvas_elem).attr('width');
    this.height= $(this.canvas_elem).attr('height');

//Listen for keypress
    $(window).keydown(function(event) {
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = true;
    });

//Ignore key release
    $(window).keyup(function(event) {
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = false;
    });

    this.level_data = level_data;
    this.callbacks = callbacks;
    Sprites.load(sprite_data,this.callbacks['start']);
  };

  this.loadBoard = function(board) { Game.board = board; };
//set framerate/game speed
  this.loop = function() { 
    Game.board.step(30/1000); 
    Game.board.render(Game.canvas);
    setTimeout(Game.loop,30);
  };
};

//Load spritesheet
var Sprites = new function() {
  this.map = { }; 

  this.load = function(sprite_data,callback) { 
    this.map = sprite_data;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';
  };

  this.draw = function(canvas,sprite,x,y,frame) {
    var s = this.map[sprite];
    if(!frame) frame = 0;
    canvas.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x,y, s.w, s.h);
  };
}

//Load start screen text and listen for enter keypress
var GameScreen = function GameScreen(text,text2,callback) {
  this.step = function(dt) {
    if(Game.keys['enter'] && callback) 
        callback();
        var scorediv = document.getElementById("scoreboard");
        var scorectx = scorediv.getContext("2d");
//        score board text and formatting
        scorectx.fillStyle = "#000000";
        scorectx.fillRect(0,0,500,25);
        scorectx.fillStyle = "#FFFFFF";
        scorectx.font = "15px retroville";
        scorectx.textAlign = "center";
        scorectx.fillText("Aliens with feelings needlessly murdered: "+score,250,18);
  };

//Font styling for menu screens
  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    canvas.font = "36px retroville";
    var measure = canvas.measureText(text);  
    canvas.fillStyle = "#FFFFFF";
    canvas.fillText(text,Game.width/2 - measure.width/2 + 4,Game.height/2);
    canvas.font = "20px retroville";
    var measure2 = canvas.measureText(text2);
    canvas.fillText(text2,Game.width/2 - measure2.width/2,Game.height/2 + 40);
//    Display player controls
    var c = document.getElementById("feelingsboard");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,500,100);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "15px retroville";
    ctx.textAlign = "center";
    ctx.fillText("PLAYER CONTROLS:",250,18);
    ctx.fillText("MOVE: LEFT AND RIGHT ARROW KEYS",250,36);
    ctx.fillText("FIRE: SPACE BAR",250,54);
  };
};

var GameBoard = function GameBoard(level_number) {
  this.removed_objs = [];
  this.missiles = 0;
  this.level = level_number;
  var board = this;

  this.add =    function(obj) { obj.board=this; this.objects.push(obj); return obj; };
  this.remove = function(obj) { this.removed_objs.push(obj); };

  this.addSprite = function(name,x,y,opts) {
    var sprite = this.add(new Sprites.map[name].cls(opts));
    sprite.name = name;
    sprite.x = x; sprite.y = y;
    sprite.w = Sprites.map[name].w; 
    sprite.h = Sprites.map[name].h;
    return sprite;
  };
  

  this.iterate = function(func) {
     for(var i=0,len=this.objects.length;i<len;i++) {
       func.call(this.objects[i]);
     }
  };

  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  this.step = function(dt) {

//Add red alienship
    if(Math.random()*1000<1) { //Every frame a ship has 1/1000 of appearing
        var alienship=this.addSprite('alienship', -32, 10, { dx: +2 }); //Draw ship offscreen and move to right, speed set here
    };
      
    this.removed_objs = [];
    this.iterate(function() { 
        if(!this.step(dt)) this.die();
    }); 

    for(var i=0,len=this.removed_objs.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed_objs[i]);
      if(idx != -1) this.objects.splice(idx,1);
    }
  };

  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    this.iterate(function() { this.draw(canvas); });
  };

  this.collision = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  this.collide = function(obj) {
    return this.detect(function() {
      if(obj != this && !this.invulnrable)
       return board.collision(obj,this) ? this : false;
    });
  };

//Load spaceship sprite    
  this.loadLevel = function(level) {
    this.objects = [];
    this.player = this.addSprite('player', // Sprite
                                 Game.width/2, // X
                                 Game.height - Sprites.map['player'].h - 10); // Y

//Load alien sprites      
    var flock = this.add(new AlienFlock());
    for(var y=0,rows=level.length;y<rows;y++) {
      for(var x=0,cols=level[y].length;x<cols;x++) {
        var alien = Sprites.map['alien' + level[y][x]];
        if(alien) { 
          this.addSprite('alien' + level[y][x], // Which Sprite
                         (alien.w+10)*x,  // X
                         alien.h*y,       // Y
                         { flock: flock }); // Options
        }
      }
    }
  };

  this.nextLevel = function() { 
    return Game.level_data[level_number + 1] ? (level_number + 1) : false 
  };
 
  this.loadLevel(Game.level_data[level_number]);
};

var GameAudio = new function() {
  this.load_queue = [];
  this.loading_sounds = 0;
  this.sounds = {};

  var channel_max = 10;		
  audio_channels = new Array();
  for (a=0;a<channel_max;a++) {	
    audio_channels[a] = new Array();
    audio_channels[a]['channel'] = new Audio(); 
    audio_channels[a]['finished'] = -1;	
  }

//Load game sounds    
  this.load = function(files,callback) {
    var audioCallback = function() { GameAudio.finished(callback); }

    for(name in files) {
      var filename = files[name];
      this.loading_sounds++;
      var snd = new Audio();
      this.sounds[name] = snd;
      snd.addEventListener('canplaythrough',audioCallback,false);
      snd.src = filename;
      snd.load();
    }
  };

  this.finished = function(callback) {
    this.loading_sounds--;
    if(this.loading_sounds == 0) {
      callback();
    }
  };

  this.play = function(s) {
    for (a=0;a<audio_channels.length;a++) {
      thistime = new Date();
      if (audio_channels[a]['finished'] < thistime.getTime()) {	
        audio_channels[a]['finished'] = thistime.getTime() + this.sounds[s].duration*1000;
        audio_channels[a]['channel'].src = this.sounds[s].src;
        audio_channels[a]['channel'].load();
        audio_channels[a]['channel'].play();
        break;
      }
    }
  };
};