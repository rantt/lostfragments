var Player = function(game, tilex, tiley, map) {
  this.game = game;

  Phaser.Sprite.call(this, game, tilex*tileSize, tiley*tileSize, 'player');
  
  this.cursor = this.game.input.keyboard.createCursorKeys();
  this.isMoving = false;

  // this.moveDelay = 200;
  // this.moveWait = this.game.time.now + this.moveDelay;

  this.map = map;
  this.marker = new Phaser.Point(tilex,tiley);

  //Setup WASD and extra keys
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

  // this.anchor.setTo(0.5);

  this.game.physics.arcade.enable(this); // set up player physics
  // this.game.physics.p2.enable(this); // set up player physics
  this.body.fixedRotation = true; // no rotation
  // this.body.moves = false;

  this.body.collideWorldBounds = true;
  this.game.add.existing(this);

  //Create a rectangular hitbox around players body
  // this.body.clearShapes();
  // this.body.addRectangle(16,32,0,16);

  this.direction = 'down';
  this.animations.add('down', [6, 7], 6, true);
  this.animations.add('up', [8, 9], 6, true);
  this.animations.add('right', [4, 11], 6, true);
  this.animations.add('left', [5, 10], 6, true);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.update = function() {
  this.movements();
  this.updatecamera();
};
Player.prototype.movements = function() {

    if (!this.tweening) {
      if ((dialogue.hidden) && (this.cursor.left.isDown || aKey.isDown)) {
        this.moveTo(-1,0);
        this.direction = 'left';
        this.animations.play('left');
      }
      else if ((dialogue.hidden) && (this.cursor.right.isDown || dKey.isDown)) {
        this.moveTo(1,0);
        this.direction = 'right';
        this.animations.play('right');
      }
      else if ((dialogue.hidden) && (this.cursor.up.isDown || wKey.isDown)) {
        this.moveTo(0,-1);
        this.direction = 'up';
        this.animations.play('up');
      }
      else if ((dialogue.hidden) && (this.cursor.down.isDown || sKey.isDown)) {
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
  // if (this.isMoving || this.cantMove(x, y) || this.moveWait > this.game.time.now) {return;}
  this.isMoving = true;

  // this.moveWait = this.game.time.now + this.moveDelay;
  // this.x = this.x + x*64;
  // this.y = this.y + y*64;

  this.game.add.tween(this).to({x: this.x + x*64, y: this.y + y*64}, 80, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.marker.x += x;
      this.marker.y += y;
      this.isMoving = false;
    },this); 
};
Player.prototype.cantMove = function(x,y) {
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
    
    var speed = 300;
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
