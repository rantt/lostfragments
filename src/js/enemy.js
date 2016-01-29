var Enemy = function(game, options) {
  this.game = game;
  Phaser.Sprite.call(this, this.game, Game.w/2+18, Game.h/2+96, options.sheet, options.frame);
  this.anchor.setTo(0.5);
  this.health = options.health;
  this.power = options.power;
  this.flee = parseFloat(options.flee);
  this.level = parseInt(options.level);
  this.exp = parseInt(options.exp);
  this.potions = parseInt(options.potions);
}; 

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.reset = function(options) {
  Phaser.Sprite.call(this, this.game, Game.w/2+18, Game.h/2+96, options.sheet, options.frame);
  this.alive = true;
  this.anchor.setTo(0.5);
  this.level = parseInt(options.level);
  this.health = options.health;
  this.power = options.power;
  this.flee = parseFloat(options.flee);
  this.exp = parseInt(options.exp);
  this.potions = parseInt(options.potions);
  this.fixedToCamera = true;

};
Enemy.prototype.constructor = Enemy;
