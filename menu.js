var menuState = {
  create : function() {
    console.log("starting menu");
    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    spaceBar.onDown.addOnce(this.start, this);

  },

  start : function() {
    game.state.start('play');
  }

};