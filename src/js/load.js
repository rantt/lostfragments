var tileSize = 64;
var dRows = 10;
var dCols = 12;
var dialogue;

var Game = {
  w: tileSize*dCols,
  h: tileSize*dRows,
  camera: {x:0, y:0}
};


// var Game = {
//   w: 800,
//   h: 600
// };

// var w = 800;
// var h = 600;

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
    // console.log('blah'+Game.w);
		this.game.stage.backgroundColor = '#FFF';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
		this.game.load.image('instructions', 'assets/images/instructions.png');
    this.game.load.bitmapFont('minecraftia', 'assets/fonts/font.png', 'assets/fonts/font.xml'); //load default font


    // //Scale Image to Fit Window
    // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.game.scale.maxHeight = window.innerHeight;
    // this.game.scale.maxWidth = window.innerHeight*(Game.w/Game.h);

  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  preload: function() {
    
    // //Debug Plugin
    // this.game.add.plugin(Phaser.Plugin.Debug);

    //Loading Screen Message/bar
    var loadingText = this.game.add.text(Game.w, Game.h, 'Loading...', { font: '30px Helvetica', fill: '#000' });
  	loadingText.anchor.setTo(0.5, 0.5);
  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);

    //Load button for twitter
    this.game.load.image('twitter','assets/images/twitter.png');

    this.game.load.tilemap('test','assets/atlas/test.json',null,Phaser.Tilemap.TILED_JSON);
    this.game.load.spritesheet('town','assets/images/town.png',tileSize,tileSize,36);

    this.game.load.spritesheet('player','assets/images/hero_x64.png',64,64,12);
    this.game.load.spritesheet('box','assets/images/box_tiles.png',64,64,3);

    this.game.load.image('bg1', 'assets/images/battle_bg1.png');
    this.game.load.spritesheet('slime', 'assets/images/slime.png',16, 16, 2);

    this.game.load.image('textbox','assets/images/textbox.png',64,64);

    // Music Track
    // this.game.load.audio('music','soundtrack.mp3');

  },
  create: function() {
    // this.game.state.start('Menu');
    this.game.state.start('Play');
  }
};
