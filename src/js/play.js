/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var score = 0;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    // this.game.physics.startSystem(Phaser.Physics.P2JS); // start the physics
    // this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.randomEncounters = {'x0_y0':0,'x1_y0':0.1};

    this.danger = false;
    this.marker = new Phaser.Point(); ;
    this.directions = {};

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('test');
    this.map.addTilesetImage('town');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();
    this.layer2 = this.map.createLayer('layer2');
    this.layer2.resizeWorld();

    // Gray Brick
    this.map.setCollision([13,14,15]);

    // Trees
    this.map.setCollision([16,17,18],true,'layer2');

    // this.physics.p2.convertTilemap(this.map, this.layer1);
    // this.physics.p2.convertTilemap(this.map, this.layer2);

    this.player = new Player(this.game, 5,5, this.map);
    this.lastPosition = new Phaser.Point(5, 5);

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    this.danger_zone = new Phaser.Point(1,0);
    // console.log(Game.camera);
    // console.log(this.danger_zone);

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },

  update: function() {

    if (this.player.marker.x !== this.lastPosition.x || this.player.marker.y !== this.lastPosition.y) {
      this.lastPosition.x = this.player.marker.x;
      this.lastPosition.y = this.player.marker.y;

      var encounter = parseFloat(this.randomEncounters['x'+Game.camera.x+'_y'+Game.camera.y]);
      var random = Math.random();

      console.log(random + ' < ' + encounter);

      if (encounter < random) {
        console.log('Out Combat');
      }else {
        console.log('In Combat');
      }
    }

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
    var twitter_name = 'rantt_';
    var tags = ['1GAM'];

    window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  render: function() {
    // game.debug.text('Health: ' + tri.health, 32, 96);
    this.game.debug.text('Camera: ' + JSON.stringify(Game.camera), 32, 96);
    this.game.debug.text('Danger: ' + this.danger, 32, 114);
    this.game.debug.text('this.marker.x:' + this.marker.x + 'this.marker.y:'+this.marker.y, 32, 146);
    this.game.debug.text('encounter% '+ (this.randomEncounters['x'+Game.camera.x+'_y'+Game.camera.y]), 32, 164);
  }

};
