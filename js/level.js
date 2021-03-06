//Score variable
var score = 0;

//Level maps enemy positions
  var levelData = { 
     1:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,3,3,0,0,0,0],
          [0,0,0,0,0,2,2,0,0,0,0],
          [0,0,0,0,0,1,1,0,0,0,0]],
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,3,3,3,3,3,3,3,3,0],
          [0,0,3,3,3,3,3,3,3,3,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0]],
     3:  [[3,3,3,3,3,3,3,3,3,3,3],
          [3,3,3,3,3,3,3,3,3,3,3],
          [3,3,3,3,3,3,3,3,3,3,3],
          [3,3,3,3,3,3,3,3,3,3,3],
          [2,2,2,2,2,2,2,2,2,2,2],
          [2,2,2,2,2,2,2,2,2,2,2],
          [2,2,2,2,2,2,2,2,2,2,2],
          [2,2,2,2,2,2,2,2,2,2,2],
          [1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1]] };

//Individual sprite coordinates on sprite sheet
  var spriteData = {
    'alien1': { sx: 0,  sy: 0,  w: 24, h: 18, cls: Alien, frames: 2 },
    'alien2': { sx: 0,  sy: 18, w: 24, h: 18, cls: Alien, frames: 2 },
    'alien3': { sx: 48,  sy: 0, w: 24, h: 18, cls: Alien, frames: 2 },
    'player': { sx: 0,  sy: 36, w: 26, h: 17, cls: Player },
    'missile': { sx: 0,  sy: 86, w: 3,  h: 14, cls: Missile },
    'missile2': { sx: 3,  sy: 86, w: 6,  h: 15, cls: Missile2, frames: 2 },
    'alienship': { sx: 48,  sy: 18, w: 32,  h: 12, cls: Alienship, frames: 3 }
  }

//Game text and start screens  
  function startGame() {
    var screen = new GameScreen("FEELING INVADERS","PRESS ENTER TO START",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                     Score(0);
                                 });
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {
    var screen = new GameScreen("GAME OVER","PRESS ENTER TO RESTART",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                     score = 0; //Reset score for next play but don't refresh display so user can see their previous score until new game is initiated
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {
    var screen = new GameScreen("YOU WIN!","PRESS ENTER TO RESTART",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }

//Load sound files
  $(function() {
    GameAudio.load({ 'fire' : 'media/laser.ogg', 'die' : 'media/explosion.ogg', 'blip' : 'media/blip.ogg', 'alienship' : 'media/alienship.ogg' }, 
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "win"  : winGame });
                   });
   });



