var Panel = function(game, x, y, width, height, tileSize, spritesheet) {
  // Expects a sprite sheet of 3 images in the following order
  // Top Corner, Top Middle and Middle

  this.game = game;
  this.panelGroup = this.game.add.group();

  for(var i = 0; i < height; i++) {
    for(var j = 0; j < width;j++) {
      var panelSprite = this.game.add.sprite(x + tileSize*j, y + tileSize*i, spritesheet, 0)
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
      this.panelGroup.add(panelSprite);
    }
  }
  return this.panelGroup;
};


Panel.prototype.constrctor = Panel;
