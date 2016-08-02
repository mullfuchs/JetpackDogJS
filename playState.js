
//var game = new Phaser.Game(800, 600, Phaser.AUTO, '#gameDiv', { preload: preload, create: create, update: update});
var score = 0;
var scoreText;
var statusText;

var playState = {

    create : function() {
        //var this.score = 0;
        //scoreText;
        game.add.sprite(0,0, 'sky');

        this.initGround();

        this.initPlayer();

        this.initStars();



        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        statusText = game.add.text((game.world.height / 2) - 16, (game.world.width / 2), "", { fontSize: '32px', fill: '#F00' });

        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createStar, this);

        game.add.sprite(0, 0, 'star');

        bullets = game.add.group()
        bullets.enableBody = true;

        //cursors = game.input.keyboard.createCursorKeys();
        //this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.Z]);

    },

    update : function() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.overlap(player, stars, this.playerHit, null, this);
        game.physics.arcade.overlap(bullets, stars, this.collectStar, null, this);
        this.updatePlayer();
    },

    initPlayer : function(){
                    // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        return player;
    },

    initGround : function(){
        platforms = game.add.group();
        platforms.enableBody = true;

        
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        var celing = platforms.create(0, 0, 'ground');

        celing.scale.setTo(2, 2);

        celing.body.immovable = true;

        game.physics.enable(platforms);
        return platforms;
    },

    initStars : function(){
        stars = game.add.group();

        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 6;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        this.createStar();
    },

    updatePlayer : function(){
                    //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.frame = 6;

        //  Allow the player to jump if they are touching the ground.
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            player.body.gravity.y = -300;
        }
        else//(this.spaceKey.isUp())
        {
            player.body.gravity.y = 300;
        }

        if(game.input.keyboard.isDown(Phaser.Keyboard.Z)){
            this.fireBullet();
        }


    },

    collectStar : function(bullet, star){
        star.kill();
        bullet.kill();
        score += 10;
        scoreText.text = 'Score: ' + score;
    },

    playerHit : function(player, star){
        player.kill();
        statusText.text = 'GAME OVER';
    },

    createStar : function(){
        var star = stars.create(game.world.width, game.rnd.integerInRange(64, game.world.height - 64), 'star');
        star.body.velocity.x = -200;
    },

    fireBullet : function(){
        var bullet = bullets.create(player.x, player.y, 'diamond');
        bullet.body.velocity.x = 400;
    }

};
