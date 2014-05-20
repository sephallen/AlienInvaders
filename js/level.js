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
    'missile2': { sx: 3,  sy: 86, w: 6,  h: 15, cls: Missile2, frames: 2 }
  }

//Game text and start screens  
  function startGame() {
    var screen = new GameScreen("FEELING INVADERS","PRESS SPACE TO START",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                     score = 1;
                                     var scorediv = document.getElementById("scoreboard");
                                     var scorectx = scorediv.getContext("2d");
                                     scorectx.fillStyle = "#000000";
                                     scorectx.fillRect(0,0,500,25);
                                     scorectx.fillStyle = "#FFFFFF";
                                     scorectx.font = "15px retroville";
                                     scorectx.fillText("Aliens with feelings needlessly murdered: 0",5,18);
                                 });
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {
    var screen = new GameScreen("GAME OVER","PRESS SPACE TO RESTART",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                     score = 1;
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {
    var screen = new GameScreen("YOU WIN!","PRESS SPACE TO RESTART",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }

  $(function() {
    GameAudio.load({ 'fire' : 'media/laser.ogg', 'die' : 'media/explosion.ogg' }, 
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "win"  : winGame });
                   });
   });



