var winScreen = {
  create : function(){
        game.add.sprite(0,0, 'sky');

        background = this.add.tileSprite(0,80,this.game.width, this.game.height,'Mountains2');
        background.autoScroll(-5, 0);        

        background = this.add.tileSprite(0,100,this.game.width, this.game.height,'Mountains');
        background.autoScroll(-10, 0);        

        background = this.add.tileSprite(0,450,this.game.width, 100,'TreeBG');
        background.autoScroll(-20, 0);

        this.game.time.events.add(1000, this.displayText, this, "YOU WON", 200);
        this.game.time.events.add(2000, this.displayText, this, "Final Score: " + score, 300);
        this.game.time.events.add(3000, this.displayText, this, "Bullets fired: " + bulletsFired, 350)
        this.game.time.events.add(4000, this.displayText, this, "Accuracy: " + Math.floor(bulletsFired / hitCounter) + "%", 400);
        this.game.time.events.add(5000, this.displayText, this, "Press the Z key to play again", 450);
        this.game.time.events.add(5000, function(){
              key1 = game.input.keyboard.addKey(Phaser.Keyboard.Z);
              key1.onDown.add(this.restartPlay, this);
              //key1.onDown.add(this.game.state.start, this, 'play');
        }, this);
  },

  restartPlay : function(){
    game.state.start('play');
  },

  displayText : function(text, xPosition){
      game.add.text((game.world.width / 2) - 250, xPosition, text, { fontSize: '40px', fill: '#070F00' });
  }

};