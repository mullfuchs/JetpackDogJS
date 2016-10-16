var bootState = {
  create: function() {
    console.log("booted game");
     game.physics.startSystem(Phaser.Physics.ARCADE);
     game.state.start('load');
     game.time.advancedTiming = true;
     game.time.desiredFps = 60;
     game.time.slowMotion = 1.0;
  }
};