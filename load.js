var loadState = {
    preload: function() {
      game.load.image('sky', 'assets/skyBG.png');
      game.load.image('star', 'assets/star.png');
      game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
      game.load.image('ground', 'assets/platform2.png');
      game.load.image('debris', 'assets/debris.png');
      game.load.image('diamond', 'assets/diamond.png');
      game.load.image('logo', 'assets/JetPackDogLogo.png');
      game.load.image('powerup', 'assets/powerUp.png');

      game.load.image('jetpackDog', 'assets/jetpackDog.png');
      game.load.image('bullet', 'assets/bullet3.png');

      game.load.image('Enemy1','assets/Enemy1.png');
      game.load.image('Enemy2','assets/Enemy2.png');
      game.load.image('Enemy3','assets/Enemy3.png');
      game.load.image('Enemy4','assets/Enemy4.png');

      game.load.image('Mountains', 'assets/mountains2.png');
      game.load.image('Mountains2', 'assets/mountains.png');
      game.load.image('TreeBG', 'assets/TreeBG.png');

      game.load.image('flash', 'assets/muzzleFlash.png');

      game.load.audio('gunshot', 'assets/Gunshot.wav');
      game.load.audio('hitsound', 'assets/HitSound.wav');
      game.load.audio('explosion', 'assets/Explosion.wav');

      console.log("loading assets");
  },

  create: function(){
    game.state.start('menu');
  }

};