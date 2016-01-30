var Player = function(game, tilex, tiley, map) {
  this.game = game;

  Phaser.Sprite.call(this, game, tilex*tileSize, tiley*tileSize, 'player');
  this.level = 1;
  this.health = this.maxHealth();
  this.hearts = 0;
  this.potion = 3;
  this.inCombat = false;
  this.isMoving = false;
  this.nextLevel = 100;
  this.exp = 0;

  this.map = map;
  this.marker = new Phaser.Point(tilex,tiley);

  this.cursor = this.game.input.keyboard.createCursorKeys();

  //Setup WASD and extra keys
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

  // this.anchor.setTo(0.5);

  this.game.physics.arcade.enable(this); // set up player physics
  this.body.fixedRotation = true; // no rotation
  this.body.moves = false;

  this.game.add.existing(this);

  this.direction = 'down';
  this.animations.add('down', [6, 7], 6, true);
  this.animations.add('up', [8, 9], 6, true);
  this.animations.add('right', [4, 11], 6, true);
  this.animations.add('left', [5, 10], 6, true);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.reset = function(tilex,tiley) {

  Phaser.Sprite.call(this, game, tilex*tileSize, tiley*tileSize, 'player');
  // this.level = 1;
  this.health = this.maxHealth();
  this.potion = 0;
  this.inCombat = false;
  this.isMoving = false;

  this.marker = new Phaser.Point(tilex,tiley);

  this.game.physics.arcade.enable(this); // set up player physics
  this.body.fixedRotation = true; // no rotation
  this.body.moves = false;

  this.game.add.existing(this);

  this.direction = 'down';
  this.animations.add('down', [6, 7], 6, true);
  this.animations.add('up', [8, 9], 6, true);
  this.animations.add('right', [4, 11], 6, true);
  this.animations.add('left', [5, 10], 6, true);

};
Player.prototype.loadStats = function() {
    ////// STATS BOX //////
    this.stats_box = new Panel(this.game, 50, 100, 3, 4, 64, 'box');

    this.level_text = this.game.add.bitmapText(40, 100, 'minecraftia', 'Level: '+this.level, 20); 
    this.level_text.fixedToCamera = true;
    this.stats_box.add(this.level_text);
    
    this.health_text = this.game.add.bitmapText(40, 136, 'minecraftia', 'Health: '+this.health, 20); 
    this.health_text.fixedToCamera = true;
    this.stats_box.add(this.health_text);
    
    this.potion_text = this.game.add.bitmapText(40, 172, 'minecraftia', 'Potions: '+this.potion, 20); 
    this.potion_text.fixedToCamera = true;
    this.stats_box.add(this.potion_text);

    this.heart_text = this.game.add.bitmapText(40, 208, 'minecraftia', 'Heart:'+this.hearts+'/3', 20); 
    this.heart_text.fixedToCamera = true;

    this.stats_box.add(this.heart_text);

    this.exp_text = this.game.add.bitmapText(40, 246, 'minecraftia', 'Exp:'+this.exp+'/'+this.nextLevel, 20); 
    this.exp_text.fixedToCamera = true;

    this.stats_box.add(this.exp_text);

};
Player.prototype.refreshStats = function() {
  this.level_text.setText('Level: '+this.level);
  this.health_text.setText('Health: '+this.health);
  this.potion_text.setText('Potions: '+this.potion);
  this.heart_text.setText('Heart:'+this.hearts+'/3');
  this.exp_text.setText('Exp:'+this.exp+'/'+this.nextLevel);
};
Player.prototype.maxHealth = function() {
	return 8 + this.level * 2;
};
Player.prototype.addExp = function(exp) {
  this.exp += exp;
  if (this.exp >= this.nextLevel) {
    this.exp = this.exp - this.nextLevel;
    this.level++;
    this.nextLevel = this.level*100; 
  }
};
Player.prototype.takePotion = function() {
  if (this.potions <= 0) {return;}
  var hp = Math.ceil(this.maxHealth()/3);

  this.potion--;
	if (this.health + hp > this.maxHealth()) {
		this.health = this.maxHealth();
	}else {
		this.health += hp;
	}
	return this.health;
};
Player.prototype.update = function() {
  // Show Stats Menu when player is standing still
  if (this.isMoving) {
    this.movementTimer = this.game.time.now + 2000;
    this.stats_box.visible = false;
  }else {
    if (this.game.time.now > this.movementTimer) {
      this.stats_box.visible = true;
    }
  }

  this.movements();
  this.updatecamera();
};
Player.prototype.movements = function() {

    if (!this.tweening) {
      if ( (this.cursor.left.isDown || aKey.isDown || leftArrow)) {
        this.moveTo(-1,0);
        this.direction = 'left';
        this.animations.play('left');
      }
      else if ( (this.cursor.right.isDown || dKey.isDown || rightArrow)) {
        this.moveTo(1,0);
        this.direction = 'right';
        this.animations.play('right');
      }
      else if ( (this.cursor.up.isDown || wKey.isDown || upArrow)) {
        this.moveTo(0,-1);
        this.direction = 'up';
        this.animations.play('up');
      }
      else if ( (this.cursor.down.isDown || sKey.isDown || downArrow)) {
        this.moveTo(0,1);
        this.direction = 'down';
        this.animations.play('down');
      }
      else {
        if (this.direction === 'up') {
          this.frame = 1;
        }
        else if (this.direction === 'down') {
          this.frame = 0;
        }
        else if (this.direction === 'right') {
          this.frame = 2;
        }
        else if (this.direction === 'left') {
          this.frame = 3;
        }
        this.animations.stop();
      }
    } 

};
Player.prototype.moveTo = function(x,y) {
  if (this.isMoving || this.cantMove(x, y)) {return;}
  this.isMoving = true;

  this.game.add.tween(this).to({x: this.x + x*64, y: this.y + y*64}, 120, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.marker.x += x;
      this.marker.y += y;
      this.isMoving = false;
    },this); 
};
Player.prototype.cantMove = function(x,y) {
  if (this.inCombat) {return true;}

  var newx = this.marker.x + x;
  var newy = this.marker.y + y;

  var tile1 = this.map.getTile(newx, newy, 0); 

  //Block Moving onto a non-existent tile
  if (tile1 === null) {
    return true;
  }

  //Block Layer 1 Collisions
  if (this.map.getTile(newx, newy, 0).collideDown) {
    return true;
  }

  //Block Layer 2 Collisions if applicable
  if (this.map.getTile(newx, newy, 1) !== null) {
    return this.map.getTile(newx, newy, 1).collideDown;
  }
  return false;

};
Player.prototype.updatecamera = function() {
    if (this.tweening) {
      return;
    }
    this.tweening = true;
    
    var speed = 700;
    var toMove = false;

    if (this.y > this.game.camera.y + Game.h - 64) {
      Game.camera.y += 1;
      toMove = true;
    }
    else if (this.y < this.game.camera.y) {
      Game.camera.y -= 1;
      toMove = true;
    }
    else if (this.x > this.game.camera.x + Game.w - 64) {
      Game.camera.x += 1;
      toMove = true;
    }
    else if (this.x < this.game.camera.x) {
      Game.camera.x -= 1;
      toMove = true;
    }

    if (toMove) {
      var t = this.game.add.tween(this.game.camera).to({x:Game.camera.x*Game.w, y:Game.camera.y*Game.h}, speed);
      t.start();
      t.onComplete.add(function(){this.tweening = false;}, this);
    }
    else {
      this.tweening = false;
    }

};
Player.prototype.constructor = Player;
