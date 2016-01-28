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

    this.randomEncounters = {'x0_y0':1,'x1_y0':0.1};

    this.danger = false;
    this.marker = new Phaser.Point();
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

    this.battleLogPanel = new Panel(this.game, 150, 500, 9, 2, 64, 'box');
    this.battleLog = this.game.add.bitmapText(150, 500, 'minecraftia', '', 24);
    this.battleLog.fixedToCamera = true;


    this.player.loadStats();

		this.turn = this.player;
    this.battleInitiated = false;

		this.battleGroup = this.game.add.group();

    this.battleGround = this.game.add.sprite(Game.w/2+18, Game.h/2, 'bg1');
    this.battleGround.anchor.setTo(0.5);
		this.battleGroup.add(this.battleGround);


		this.enemy = new Enemy(this.game, {'sheet': 'slime', 'health': 4, 'power': 2,'flee': 1,'level':1});

		this.battleGroup.add(this.enemy);
    this.attack_button = this.game.add.button(Game.w - 96, 192, this.makeBox(128,64),function(){
			console.log('clicked attack');
			if (this.player.inCombat && this.turn == this.player) {
				this.enemy.health -= this.player.level;
  			this.game.add.tween(this.enemy).to({tint: 0xff0000},100).to({tint: 0xffffff},100).start();
				this.turn = this.enemy;
        this.combatWait = this.game.time.now + 1000;
        console.log('player hit enemy for '+ this.player.level);
        this.battleLog.setText('player hit enemy for '+ this.player.level);
        // dialogue.show('player hit enemy for '+ this.player.level);
			}

		},this); 
		this.attack_button.anchor.setTo(0.5);
		this.attack_button.tint = 0x000000;
    this.attack_text = this.game.add.bitmapText(Game.w -96, 200, 'minecraftia', 'Attack', 28); 
		this.attack_text.anchor.setTo(0.5);
		this.battleGroup.add(this.attack_button);
		this.battleGroup.add(this.attack_text);

    this.potion_button = this.game.add.button(Game.w - 96, 288, this.makeBox(128,64),function(){
			this.player.takePotion(4);
      this.player.refreshStats();
			// this.player.health_text.setText('Health: '+this.player.health);
			this.turn = this.enemy;
      this.combatWait = this.game.time.now + 1000;
			},this); 
		this.potion_button.anchor.setTo(0.5);
		this.potion_button.tint = 0x000000;
    this.potion_text = this.game.add.bitmapText(Game.w -96, 296, 'minecraftia', 'Potion', 28); 
		this.potion_text.anchor.setTo(0.5);
		this.battleGroup.add(this.potion_button);
		this.battleGroup.add(this.potion_text);

    this.flee_button = this.game.add.button(Game.w - 96, 384, this.makeBox(128,64),function(){
			if (Math.random() < this.enemy.flee) {
				this.player.inCombat = false;
        this.battleInitiated = false;
				console.log('combat over');
				this.battleGroup.visible = false;
        this.player.alpha = 1; 
			}
		},this); 
		this.flee_button.anchor.setTo(0.5);
		this.flee_button.tint = 0x000000;
    this.flee_text = this.game.add.bitmapText(Game.w -96, 392, 'minecraftia', 'Flee', 28); 
		this.flee_text.anchor.setTo(0.5);
		this.battleGroup.add(this.flee_button);
		this.battleGroup.add(this.flee_text);

    // this.combatPanel = new Panel(this.game, 210, Game.h - 175, 7, 3, 64, 'box');
    // this.combatText = this.game.add.bitmapText(200, 460, 'minecraftia', '', 24);
    // this.combatPanel.visible = false;
    // this.combatText.fixedToCamera = true;
    //
		this.battleGroup.visible = false;
    this.battleGroup.fixedToCamera = true;

    // dialogue = new Dialogue(this.game);

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },
	makeBox: function(x,y) {
		var bmd = this.game.add.bitmapData(x, y);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, x, y);
		bmd.ctx.fillStyle = '#fff';
		bmd.ctx.fill();
		return bmd;
	},
  update: function() {

    if (this.player.inCombat) {
			// console.log('FIGHTING'); 
      if (this.battleInitiated === false) {
				this.enemy.kill();
				this.enemy.reset({'sheet': 'slime', 'health': 4, 'power': 1,'flee': 1,'frame':0,'level': 2});

        console.log('el'+this.enemy.level);
        this.battleInitiated = true;
        this.player.stats_box.visible = true;
        this.battleGroup.visible = true;
        this.player.alpha = 0;
        this.battleLog.setText('Enemy Approaches');
      }

			if (this.enemy.health <= 0) {
				this.player.inCombat = false;
				this.battleGroup.visible = false;
        this.battleInitiated = false;
        this.player.alpha = 1;
        this.battleLog.setText('Combat Ended\nYou receive: ');
			}
			if (this.player.health === 0) {
				this.battleGroup.visible = false;
				this.player.kill();
				this.player.reset(5, 7);
        this.player.refreshStats();
        this.player.alpha = 1;
        this.battleInitiated = false;
        this.battleLog.setText('You Died\n How Sad For You :{');
			}

			//Begin Combat
			if (this.turn === this.enemy && this.game.time.now > this.combatWait) {
				this.turn = this.player;
        var hitChance = parseFloat(0.9 + (this.enemy.level - this.player.level)*0.1);
        var random = Math.random();
        console.log(random + ' hc'+hitChance);
        if (random < hitChance) {
          
          this.battleLog.setText('player hit for '+this.enemy.power+' points of dmg');
          this.player.health -= this.enemy.power;
          this.player.refreshStats();
        }else {
          this.battleLog.setText('enemy attack missed.');
          // dialogue.show('enemy attack missed.');
          // console.log('enemy attack missed');
        }
        // console.log('plvl'+this.player.level+' elvl'+this.enemy.level);
        // if (this.enemy.level > parseInt(this.player.level)) {
        //   hitChance += Math.abs(this.enemy.
        // }

			}

    }else {
      // Check For an Encounter
      if (this.player.marker.x !== this.lastPosition.x || this.player.marker.y !== this.lastPosition.y) {
        this.lastPosition.x = this.player.marker.x;
        this.lastPosition.y = this.player.marker.y;

        var encounter = parseFloat(this.randomEncounters['x'+Game.camera.x+'_y'+Game.camera.y]);
        // var random = Math.random();

        // console.log(random + ' < ' + encounter);

        if (encounter < Math.random()) {
          // console.log('Out Combat');
        }else {
          this.player.inCombat = true;
          // console.log('In Combat');
        }
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
  // render: function() {
  //   this.game.debug.text('Camera: ' + JSON.stringify(Game.camera), 32, 96);
  //   this.game.debug.text('Danger: ' + this.danger, 32, 114);
    // this.game.debug.text('this.marker.x:' + this.marker.x + 'this.marker.y:'+this.marker.y, 32, 146);
    // this.game.debug.text('encounter% '+ (this.randomEncounters['x'+Game.camera.x+'_y'+Game.camera.y]), 32, 164);
  // }

};
