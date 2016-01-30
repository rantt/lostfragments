/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.randomEncounters = {'x0_y0':0,'x2_y0':0,'x2_y2':0,'x1_y1':0,'x0_y1':0,'x3_y1':0,'x3_y0':0};
    // this.randomEncounters = {'x0_y0':0,'x2_y0':0.1,'x2_y2':0.1,'x1_y1':0.1,'x0_y1':0.1,'x3_y1':0.1,'x3_y0':0.2};
    this.posKey = 'x0_y0';

    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles');

    this.layer1 = this.map.createLayer('layer1');
    this.layer2 = this.map.createLayer('layer2');
    this.map.setCollision([1,7,8,9,10,11]);
    this.map.setCollision([1,7,8,9,10,11,14,15,16,17],true,'layer2');


    this.layer1.resizeWorld();
    this.layer2.resizeWorld();


    this.hearts = this.game.add.group();

    this.map.createFromObjects('objects', 29, 'hearts', 9, true, false, this.hearts);//yellow
    this.map.createFromObjects('objects', 20, 'hearts', 0, true, false, this.hearts);//empty
    this.map.createFromObjects('objects', 30, 'hearts', 10, true, false, this.hearts);
    this.map.createFromObjects('objects', 31, 'hearts', 11, true, false, this.hearts);//red

    //Signs
    this.signs = this.game.add.group();
    this.map.createFromObjects('objects', 19, 'tiles', 18, true, false, this.signs);//yellow

    this.hearts.forEach(function(h) {
      h.y += h.height/2;
      var t = this.game.add.tween(h).to({y: '-5'}, 500).to({y: '5'},500);
      t.loop(true).start();
    },this);

    this.player = new Player(this.game, 5,4, this.map);
    this.lastPosition = new Phaser.Point(5, 4);


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


    this.player.loadStats();
    
    this.battleLogPanel = new Panel(this.game, 150, 500, 9, 2, 64, 'box');
    this.battleLogPanel.visible = false;
    this.battleLog = this.game.add.bitmapText(150, 500, 'minecraftia', '', 24);
    this.battleLog.fixedToCamera = true;

		this.turn = this.player;
    this.battleInitiated = false;

		this.battleGroup = this.game.add.group();

    this.battleGround = this.game.add.sprite(Game.w/2+18, Game.h/2, 'backdrops',0);
    this.battleGround.anchor.setTo(0.5);
		this.battleGroup.add(this.battleGround);

		this.enemy = new Enemy(this.game, {'sheet': 'slime', 'health': 4, 'power': 2,'flee': 1,'level':1});
		this.enemy.kill();

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
			}
		},this); 

		this.attack_button.anchor.setTo(0.5);
		this.attack_button.tint = 0x000000;
    this.attack_text = this.game.add.bitmapText(Game.w -96, 200, 'minecraftia', 'Attack', 28); 
		this.attack_text.anchor.setTo(0.5);
		this.battleGroup.add(this.attack_button);
		this.battleGroup.add(this.attack_text);

    this.potion_button = this.game.add.button(Game.w - 96, 288, this.makeBox(128,64),function(){
			this.player.takePotion();
      this.player.refreshStats();
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

		this.battleGroup.visible = false;
    this.battleGroup.fixedToCamera = true;

    //Initialize Sign 
    this.sign_text = this.game.add.bitmapText(32, 480,'minecraftia','',24);
    this.sign_text.fixedToCamera = true;
    


    //Create Twitter button as invisible, show during win condition to post highscore
    this.win_text = this.game.add.bitmapText(Game.w/2, Game.h/2-100,'minecraftia','YOU WIN!',48);
    this.win_text.anchor.setTo(0.5);
    this.twitterButton = this.game.add.button(Game.w/2+100, Game.h/2+90,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = true;
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

    this.hearts.forEach(function(heart) {
      if (checkOverlap(this.player, heart)) {
        heart.destroy(); 
        this.player.hearts++;
        this.player.loadStats();
      }
      if (this.player.hearts === 3 && heart.frame === 0) {
         heart.frame = 1; 
      }
    },this);

    this.signs.forEach(function(sign) {
      if (checkOverlap(this.player, sign)) {
        this.lastRead = this.game.time.now + 500;
        this.sign_text.setText(sign.text);
      }
    },this);

    if (this.game.time.now > this.lastRead) {
      this.sign_text.setText('');
    }


    function checkOverlap(spriteA, spriteB) {
      var boundsA = spriteA.getBounds();
      var boundsB = spriteB.getBounds();
      return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    if (this.player.inCombat) {
      if (this.battleInitiated === false) {
        
        var enemy =  {'sheet': 'slime', 'health': 4, 'power': 1,'flee': 1,'frame':0,'level': 1,'exp':20,'potions':rand(0,1)}; //default enemy
        
          console.log('here');

          // if (this.posKey === 'x0_y0') {
          //   this.battleGround.frame = 2;
          // }
        if (this.posKey === 'x2_y0') {
          this.battleGround.frame = 0;
        }else if (this.posKey === 'x2_y2') {
          this.battleGround.frame = 0;
          enemy.frame = 1;
          enemy.power = rand(1,3);
          enemy.level = enemy.power;
          enemy.exp = (enemy.power - 1)*10 + 10;
        }else if(this.posKey === 'x1_y1' || this.posKey === 'x0_y1') {
          this.battleGround.frame = 1;
          enemy.frame = 2;
          enemy.health = 8;
          enemy.power = rand(3,5);
          enemy.level = enemy.power;
          enemy.exp = (enemy.power - 1)*10 + 10;
        }else if (this.posKey === 'x3_y1') {
          this.battleGround.frame = 2;
          enemy.health = 12;
          enemy.frame = 0;
          enemy.power = 6;
          enemy.level = enemy.power+2;
          enemy.frame = rand(0,1);
          enemy.exp = (enemy.power - 1)*10 + 10;
          enemy.sheet = 'rat';
        }else if (this.posKey === 'x3_y0') {
          this.battleGround.frame = 3;
          enemy.health = 15;
          enemy.frame = 3;
          enemy.flee = 0.5;
          enemy.power = rand(8,10);
          enemy.level = enemy.power+2;
          enemy.frame = rand(0,1);
          enemy.exp = (enemy.power - 1)*10 + 10;
          enemy.sheet = 'skeleton';
        }


				this.enemy.reset(enemy);

        this.battleLogPanel.visible = true;
        this.battleInitiated = true;
        this.player.stats_box.visible = true;
        this.battleGroup.visible = true;
        this.player.alpha = 0;
        this.battleLog.setText('Enemy Approaches');
      }

			if (this.enemy.health <= 0) {
        this.enemy.kill();
				this.player.inCombat = false;
				this.battleGroup.visible = false;
        this.battleInitiated = false;
        this.player.alpha = 1;
        var msg = 'Combat Ended\nYou receive: '; 
        if (this.enemy.potions > 0) {
          msg += this.enemy.potions + ' potions. ';
          this.player.potion += this.enemy.potions;
        }
        msg += this.enemy.exp + ' exp.';
        this.player.addExp(this.enemy.exp);
        this.player.refreshStats();

        this.battleLog.setText(msg);

        this.turn = this.player;
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
          // this.game.plugins.ScreenShake.start(7);
          this.battleLog.setText('player hit for '+this.enemy.power+' points of dmg');
          // this.player.health -= this.enemy.power + this.enemy.level - 1;
          this.player.health -= this.enemy.power;
          this.player.refreshStats();
        }else {
          this.battleLog.setText('enemy attack missed.');
        }
			}

    }else {
      // Check For an Encounter
      if (this.player.marker.x !== this.lastPosition.x || this.player.marker.y !== this.lastPosition.y) {
        console.log('in here');
        this.battleLogPanel.visible = false;
        this.battleLog.setText('');
        this.lastPosition.x = this.player.marker.x;
        this.lastPosition.y = this.player.marker.y;

        this.posKey = 'x'+Game.camera.x+'_y'+Game.camera.y;
        console.log('posKey'+this.posKey);

        var encounter = parseFloat(this.randomEncounters[this.posKey]);
        console.log(encounter);

        if (encounter > Math.random()) {
          this.player.inCombat = true;
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
  render: function() {
    this.hearts.forEach(function(heart) {
      this.game.debug.body(heart); 
    },this);
  //   this.game.debug.text('Camera: ' + JSON.stringify(Game.camera), 32, 96);
  //   this.game.debug.text('Danger: ' + this.danger, 32, 114);
    // this.game.debug.text('this.marker.x:' + this.marker.x + 'this.marker.y:'+this.marker.y, 32, 146);
    // this.game.debug.text('encounter% '+ (this.randomEncounters['x'+Game.camera.x+'_y'+Game.camera.y]), 32, 164);
  }

};
