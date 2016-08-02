var loadState = {
    preload: function() {
      game.load.image('sky', 'assets/sky.png');
      game.load.image('star', 'assets/star.png');
      game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
      game.load.image('ground', 'assets/platform.png');
      game.load.image('diamond', 'assets/diamond.png');
      game.load.image('logo', 'phaser.png');
      console.log("loading assets");
  },

  create: function(){
    game.state.start('menu');
  }

};