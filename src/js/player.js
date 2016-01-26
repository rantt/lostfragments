var Player = function(game, tilex, tiley, map, layers) {
  this.game = game;

  Phaser.Sprite.call(this, game, tilex*tileSize, tiley*tileSize, 'player');
  
  this.cursor = this.game.input.keyboard.createCursorKeys();
  this.isMoving = false;

  this.map = map;
  this.layers = [];
  for(var i=0;i < layers.length;i++) {
    this.layers.push(layers[i].index);
  }
  console.log(this.layers);
  this.marker = new Phaser.Point(tilex,tiley);
  this.marker.x = tilex;
  this.marker.y = tiley;

  //Setup WASD and extra keys
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

  // this.anchor.setTo(0.5);

  this.game.physics.arcade.enable(this); // set up player physics
  // this.game.physics.p2.enable(this); // set up player physics
  this.body.fixedRotation = true; // no rotation

  this.body.moves = false;

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
    // this.body.velocity.x = 0;
    // this.body.velocity.y = 0;

    // var speed = 275;

    if (this.tweening) {
      //Don't move while camera is panning
      // this.body.velocity.x = 0;
      // this.body.velocity.y = 0;
    }else{
      //Don't move when the dialogue box is visible
      if ((dialogue.hidden) && (this.cursor.left.isDown || aKey.isDown)) {
        // this.body.velocity.x = -speed;
        this.moveTo(-1,0);
        this.direction = 'left';
        this.animations.play('left');
      }
      else if ((dialogue.hidden) && (this.cursor.right.isDown || dKey.isDown)) {
        // this.body.velocity.x = speed;
        this.moveTo(1,0);
        this.direction = 'right';
        this.animations.play('right');
      }
      else if ((dialogue.hidden) && (this.cursor.up.isDown || wKey.isDown)) {
        // this.body.velocity.y = -speed;
        this.moveTo(0,-1);
        this.direction = 'up';
        this.animations.play('up');
      }
      else if ((dialogue.hidden) && (this.cursor.down.isDown || sKey.isDown)) {
        // this.body.velocity.y = speed;
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

  this.game.add.tween(this).to({x: this.x + x*64, y: this.y + y*64}, 80, 'Linear', true)
    .onComplete.add(function() {
      this.isMoving = false;
      this.marker.x += x;
      this.marker.y += y;
    },this); 
};
Player.prototype.cantMove = function(x,y) {
  var newx = this.marker.x + x;
  var newy = this.marker.y + y;

  var newtile = this.map.getTile(newx, newy, 0,true); 

  if (newtile === null) {
    return true;
  }
  return this.map.getTile(newx, newy, 0,true).collideDown;
};

// Player.prototype.movements = function() {
//     this.body.velocity.x = 0;
//     this.body.velocity.y = 0;
//
//     var speed = 275;
//
//     if (this.tweening) {
//       //Don't move while camera is panning
//       this.body.velocity.x = 0;
//       this.body.velocity.y = 0;
//     }else{
//       //Don't move when the dialogue box is visible
//       if ((dialogue.hidden) && (this.cursor.left.isDown || aKey.isDown)) {
//         this.body.velocity.x = -speed;
//         this.direction = 'left';
//         this.animations.play('left');
//       }
//       else if ((dialogue.hidden) && (this.cursor.right.isDown || dKey.isDown)) {
//         this.body.velocity.x = speed;
//         this.direction = 'right';
//         this.animations.play('right');
//       }
//       else if ((dialogue.hidden) && (this.cursor.up.isDown || wKey.isDown)) {
//         this.body.velocity.y = -speed;
//         this.direction = 'up';
//         this.animations.play('up');
//       }
//       else if ((dialogue.hidden) && (this.cursor.down.isDown || sKey.isDown)) {
//         this.body.velocity.y = speed;
//         this.direction = 'down';
//         this.animations.play('down');
//       }
//       else {
//         if (this.direction === 'up') {
//           this.frame = 1;
//         }
//         else if (this.direction === 'down') {
//           this.frame = 0;
//         }
//         else if (this.direction === 'right') {
//           this.frame = 2;
//         }
//         else if (this.direction === 'left') {
//           this.frame = 3;
//         }
//         this.animations.stop();
//       }
//     } 
//
// };
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
