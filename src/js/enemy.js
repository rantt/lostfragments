var Enemy = function(game, options) {
  this.game = game;
  Phaser.Sprite.call(this, this.game, Game.w/2+18, Game.h/2+96, options.sheet, options.frame);
  this.anchor.setTo(0.5);
  this.scale.x = 4;
  this.scale.y = 4;
  this.health = options.health;
  this.power = options.power;
  this.flee = parseFloat(options.flee);
  this.level = parseInt(options.level);
}; 

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.reset = function(options) {
  Phaser.Sprite.call(this, this.game, Game.w/2+18, Game.h/2+96, options.sheet, options.frame);
  this.alive = true;
  this.anchor.setTo(0.5);
  this.scale.x = 4;
  this.scale.y = 4;
  this.level = parseInt(options.level);
  this.health = options.health;
  this.power = options.power;
  this.flee = parseFloat(options.flee);
  this.fixedToCamera = true;

};
Enemy.prototype.constructor = Enemy;
