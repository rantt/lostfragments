var Panel = function(game, x, y, width, height, tileSize, spritesheet) {
  // Expects a sprite sheet of 3 images in the following order
  // Top Corner, Top Middle and Middle

  this.initialX = x;
  this.initialY = y;

  this.game = game;
  Phaser.Group.call(this, this.game);

  for(var i = 0; i < height; i++) {
    for(var j = 0; j < width;j++) {
      var panelSprite = this.game.add.sprite(x + tileSize*j, y + tileSize*i, spritesheet, 0);
      panelSprite.anchor.setTo(0.5);
      panelSprite.fixedToCamera = true;
      if (i === 0) {
        if (j === 0) {
          //top corner
        }else if (j === width-1) {
          panelSprite.angle = 90;
        }else {
          panelSprite.frame = 1;
        }
      }else if (i === height-1) {
        if (j === 0) {
          panelSprite.angle = -90;
        }else if (j === width - 1) {
          panelSprite.angle = 180;
        }else {
          panelSprite.frame = 1;
          panelSprite.angle = 180; 
        }
      }else {
        if (j === 0) {
          panelSprite.frame = 1;
          panelSprite.angle = -90;
        }else if (j === width-1) {
          panelSprite.frame = 1;
          panelSprite.angle = 90;
        }else {
          panelSprite.frame = 2;
        }
      }
      this.add(panelSprite);
    }
  }
};

Panel.prototype = Object.create(Phaser.Group.prototype); 
// Panel.prototype.show = function() {
//   this.game.add.tween(this).to({alpha: 1},500,'Linear',true);
// };
// Panel.prototype.hide = function() {
//   this.game.add.tween(this).to({alpha: 0},500,'Linear',true);
// };
// Panel.prototype.text = function(text,size,font) {
//   this.font = font || 'minecraftia'; 
//   this.size = size || 24;
//
//   var line_limit = this.width/(this.size-4);//Adjust for pt to px
//
//   var words = text.split(' ');
//   var msg = '';
//   var counter = line_limit;
//   for(var i=0;i < words.length;i++) {
//     console.log(counter - words[i].length);
//     if ((counter - words[i].length) <= 0){
//       counter = line_limit;
//       msg += '\n';
//     }
//     counter -= words[i].length;
//     msg += ' '+words[i]; 
//   }
//   this.add(this.game.add.bitmapText(this.initialX, this.initialY, 'minecraftia',msg , this.size));
//   console.log(this.children.indexOf(Phaser.Bitmaptext));
//   console.log(this);
//
//   // if (this.message.text === undefined) {
//   //   this.message = this.game.add.bitmapText(this.initialX, this.initialY, 'minecraftia',msg , this.size); 
//   //   this.message.fixedToCamera = true;
//   // }else {
//   //   this.message.setTo(msg);
//   // }
//    
// };
Panel.prototype.constrctor = Panel;
