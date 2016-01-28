/*global Game*/
/*global tileSize*/

/* Typing text based on the 'Kern of Duty' example from examples.phaser.io */

var Dialogue = function(game) {
  this.game = game;
  this.hidden = true; //hide dialogue box on creation
  this.sprite = null;
  this.index = 0;
  this.line = '';
  this.text = '';
  this.typing = false;

  this.sprite = this.game.add.sprite(0,11*64,'textbox'); 
  this.sprite.alpha = 0;
  this.text = this.game.add.bitmapText(30, 7*64+30, 'minecraftia', '', 30);

};

Dialogue.prototype = {

  show: function(content) {
    if (this.typing) {
     return;
    }


    // this.index = 0;
    // this.line = '';
    // this.text.setText('');

    // this.content = content;
    this.content = content.split('*');
    this.typing = true; 

    /* Position sprite below the current screen and make it visible */
    this.sprite.x = Game.camera.x*Game.w;
    this.sprite.y = Game.camera.y*Game.h+11*64;

    this.text.x = Game.camera.x*Game.w+30;
    this.text.y = Game.camera.y*Game.h+7*64+30;
 
    this.sprite.alpha = 1;


    /* Slide Up the Dialogue Panel */
    if (this.hidden === true) {
      console.log('in here');
      var t = this.game.add.tween(this.sprite).to({x: Game.camera.x*Game.w, y: Game.camera.y*Game.h+7*64}, 250);
      t.start();
      t.onComplete.add(function() {
        this.text.setText('');
        this.line = '';
        this.index = 0;
        this.hidden = false;
        this.nextLine();
      }, this);
    }
  },

  hide: function() {
    if (this.hidden === true) {
      return;
    }

    /* Reset to defaults*/
    this.text.setText('');
    this.line = '';
    this.index = 0;

    /* Slide Down the Dialogue Panel and make it invisible */
    var t = this.game.add.tween(this.sprite).to({x: Game.camera.x*Game.w, y: Game.camera.y*Game.h+11*64}, 250);
    t.start();
    t.onComplete.add(function(){
      this.hidden = true;
      this.sprite.alpha = 0;
    }, this);
  },

  nextLine: function() {
    this.index++;

    if (this.index < this.content.length)
    {
        this.line = '';
        this.game.time.events.repeat(80, this.content[this.index].length + 1, this.updateLine, this);
    }else {
      this.typing = false;
      this.text.setText(this.line+' *');
    }
  },

  updateLine: function() {

      if (this.line.length < this.content[this.index].length)
      {
          this.line = this.content[this.index].substr(0, this.line.length + 1);
          console.log('line'+this.line);
          this.text.setText(this.line);
      }
      else
      {
          //  Wait 1 seconds then start a new line
          this.game.time.events.add(Phaser.Timer.SECOND, this.nextLine, this);
      }
  }
};
