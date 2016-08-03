
//var game = new Phaser.Game(800, 600, Phaser.AUTO, '#gameDiv', { preload: preload, create: create, update: update});
var score = 0;
var scoreText;
var statusText;
var distance = 0;
var distanceText;
var powerLevel = 0;
var powerText;
var winDistance = 350;
var bulletTimer = 1;
var bulletCounter = 0;
var gameOver = false;

var playState = {

    create : function() {
        //var this.score = 0;
        //scoreText;
        bulletCounter = bulletTimer;

        game.add.sprite(0,0, 'sky');

        background = this.add.tileSprite(0,100,this.game.width, this.game.height,'Mountains');
        background.autoScroll(-10, 0);

        this.initGround();

        this.initPlayer();

        stars = game.add.group();
        stars.enableBody = true;

        creepers = game.add.group();
        creepers.enableBody = true;
        
        enemybullets = game.add.group();
        enemybullets.enableBody = true;

        powerups = game.add.group();
        powerups.enableBody = true;

        emitter = game.add.emitter(0, 0, 100);
        emitter.makeParticles('diamond');
        emitter.gravity = 200;

        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#A2D187' });

        distanceText = game.add.text(200, 16, 'Distance: 0', { fontSize: '32px', fill: '#A2D187' });

        powerText = game.add.text(450, 16, 'Power: 0', {fontSize: '32px', fill: '#A2D187'});

        statusText = game.add.text((game.world.width / 2) - 250, (game.world.height / 2) - 16, "", { fontSize: '100px', fill: '#070F00' });

        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createShooter, this);
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createSeeker, this);
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createStar, this);
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createShooter, this);

        bullets = game.add.group()
        bullets.enableBody = true;

        //cursors = game.input.keyboard.createCursorKeys();
        //this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.Z]);

    },

    update : function() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.overlap(player, enemybullets, this.playerHit, null, this);
        game.physics.arcade.overlap(player, stars, this.playerHit, null, this);
        game.physics.arcade.overlap(bullets, stars, this.collectStar, null, this);
        game.physics.arcade.overlap(player, creepers, this.playerHit, null, this);
        game.physics.arcade.overlap(bullets, creepers, this.collectStar, null, this);
        game.physics.arcade.overlap(player, powerups, this.collectPowerup, null, this);
        creepers.forEach(function(thing){
            this.game.physics.arcade.moveToObject(thing, player, 100);
            this.playState.updateShooter(thing);
        });
        this.updatePlayer();
    },

    initPlayer : function(){
                    // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'jetpackDog');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

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
        //player.frame = 6;

        //  Allow the player to jump if they are touching the ground.
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            player.body.gravity.y = -500;
            
            if(gameOver){
                this.resetScene();
                game.state.start('play');
            }

        }
        else//(this.spaceKey.isUp())
        {
            player.body.gravity.y = 350;
        }

        if(game.input.keyboard.isDown(Phaser.Keyboard.Z)){
            this.fireBullet();
        }
        else{
            bulletCounter = 0;
        }

        if(distance >= winDistance){
            statusText.text = "You Won!";
        }
        else
        {
            distance += 0.1;
            distanceText.text = 'Distance: ' + Math.floor(distance);
        }

    },

    collectStar : function(bullet, star){

        this.particleBurst(star);
        if(game.rnd.integerInRange(0, 4) == 3){
            this.createPowerUp(star);
        }
        star.kill();
        bullet.kill();
        score += 10;
        scoreText.text = 'Score: ' + score;
    },

    playerHit : function(player, star){
        player.kill();
        gameOver = true;
        statusText.text = 'GAME OVER';
    },

    createStar : function(){
        var star = stars.create(game.world.width, game.rnd.integerInRange(64, game.world.height - 64), 'Enemy1');
        star.body.velocity.x = -200;
    },

    createSeeker: function(){
        var seeker = stars.create(game.world.width, game.rnd.integerInRange(64, game.world.height - 64), 'Enemy3');
        this.game.physics.arcade.moveToObject(seeker, player, 400);

        //            this.game.physics.arcade.moveToObject(this.enemyLaser, player.ship, 150);
    },

    createShooter: function(){
        var shooter = creepers.create(game.world.width, game.rnd.integerInRange(64, game.world.height - 64), 'Enemy2');
        shooter.body.velocity.x = -100;
        shooter.bulletCounter = 0;
        shooter.bulletTimer = 1;
    },

    updateShooter: function(enemy){
        //shoot every once in a while? float around? I dunno
        if(enemy.bulletCounter <= 0){
            var enemyBullet = enemybullets.create(enemy.x, enemy.y, 'bullet');
            enemyBullet.body.velocity.x = -500;
            enemy.bulletCounter = enemy.bulletTimer;
            console.log("Fired A Bullet????");
        }
        enemy.bulletTimer -= 0.1;
    },

    createPowerUp: function(enemy){
        var powerUp = powerups.create(enemy.x, enemy.y, 'powerup');
        powerUp.body.velocity.x = -150;
    },

    fireBullet : function(){
        if(bulletCounter <= 0){
            var bullet = bullets.create(player.x, player.y, 'bullet');
            bullet.body.velocity.x = 400 + (powerLevel * 50);
            bulletCounter = bulletTimer - (powerLevel / 10);
        }
        bulletCounter -= 0.1;
    },

    collectPowerup : function(player, powerup){
        powerup.kill();
        powerLevel += 1;
        powerText.text = "Power: " + powerLevel;
    },

    resetScene : function(){
        score = 0;
        distance = 0;
        powerLevel = 0;
        gameOver = false;
    },

    particleBurst : function(pointer) {
        var particles = this.makeEmitter();

        particles.x = pointer.x;
        particles.y = pointer.y;

        particles.start(true, 4000, null, 10);

        //  And 2 seconds later we'll destroy the emitter
        this.game.time.events.add(2000, this.destroyEmitter, this, particles);

    },

    destroyEmitter : function(inEmitter){
        inEmitter.destroy();
    },

    makeEmitter : function () {
        emitter = game.add.emitter(0, 0, 100);
        emitter.makeParticles('debris');
        emitter.gravity = 200;
        return emitter;
    }

};
