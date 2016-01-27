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

    this.player = new Player(this.game, 5,5, this.map, 2);

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
    // this.player.update();
    // this.physics.arcade.collide(this.player, this.layer1);
    // this.physics.arcade.collide(this.player, this.layer2);

    // this.marker.x = this.math.snapToFloor(Math.floor(this.player.x), 64) / 64;
    // this.marker.y = this.math.snapToFloor(Math.floor(this.player.y), 64) / 64;
    //
    // var i = this.layer1.index;
    // var x = this.marker.x;
    // var y = this.marker.y;

    // this.directions[Phaser.LEFT] = this.map.getTileLeft(i, x, y);
    // this.directions[Phaser.RIGHT] = this.map.getTileRight(i, x, y);
    // this.directions[Phaser.UP] = this.map.getTileAbove(i, x, y);
    // this.directions[Phaser.DOWN] = this.map.getTileBelow(i, x, y);
    // console.log(this.directions);
    

    // if (Game.camera == ) {
    // if (Game.camera.x == "1" && Game.camera.y == "0" ) {
    //   this.danger = true;
    // }else {
    //   this.danger = false;
    // }

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
  }

};
