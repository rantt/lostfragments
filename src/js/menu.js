/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {
        this.game.stage.backgroundColor = '#192331';

        this.game.add.tileSprite(0, 0, Game.w, Game.h, 'menu_bg');

        this.title = this.game.add.bitmapText(Game.w/2, Game.h/2-100,'exeter','Lost Fragments',64);
        this.title.anchor.setTo(0.5);

        var heart = this.game.add.sprite(Game.w/2, Game.h/2, 'hearts', 1);
        heart.anchor.setTo(0.5); 

        this.instructions = this.game.add.sprite(Game.w/2+200,200,'instructions');
        this.instructions.scale.x = 0.5;
        this.instructions.scale.y = 0.5;

        // Start Message
        var clickText = this.game.add.bitmapText(Game.w/2, Game.h/2+100, 'minecraftia', '~click to start~', 24); 
        clickText.anchor.setTo(0.5);


        var music_by = this.game.add.bitmapText(Game.w/2, Game.h/2+300, 'minecraftia', 'Music: A Better World by Trevor Lentz', 24);
        music_by.anchor.setTo(0.5);
        music_by.inputEnabled = true;
        music_by.events.onInputDown.add(function() {
          window.open("http://opengameart.org/content/opengameartorg-theme-a-better-world");
        },this);
        music_by.events.onInputOver.add(function() {
          music_by.tint = 0xffff00;
        },this);
        music_by.events.onInputOut.add(function() {
          music_by.tint = 0xffffff;
        },this);

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }
    }
};
