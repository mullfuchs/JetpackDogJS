
//var game = new Phaser.Game(800, 600, Phaser.AUTO, '#gameDiv', { preload: preload, create: create, update: update});
var score = 0;
var scoreText;
var statusText;
var distance = 350;
var distanceText;
var powerLevel = 0;
var powerText;
var winDistance = 200;
var bulletTimer = 0.3;
var bulletCounter = 0;
var gameOver = false;
var dyingAnim = false;
var pause = false;
var bulletsFired = 0;
var hitCounter = 0;
var inMelee = false;

var playState = {

    create : function() {

        bulletCounter = bulletTimer;

        game.add.sprite(0,0, 'sky');

        background = this.add.tileSprite(0,80,this.game.width, this.game.height,'Mountains2');
        background.autoScroll(-5, 0);        

        background = this.add.tileSprite(0,100,this.game.width, this.game.height,'Mountains');
        background.autoScroll(-10, 0);        

        background = this.add.tileSprite(0,450,this.game.width, 100,'TreeBG');
        background.autoScroll(-20, 0);

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

        bodies = game.add.group();
        bodies.enableBody = true;

        emitter = game.add.emitter(0, 0, 100);
        emitter.makeParticles('diamond');
        emitter.gravity = 200;

        flash = game.add.emitter(0, 0, 100);
        flash.makeParticles('flash');
        flash.gravity = 0;

        gunshot = game.add.audio('gunshot');
        hitsound = game.add.audio('hitsound');
        explosionSound = game.add.audio('explosion');

        scoreText = game.add.text(16, 20, 'Score: 0', { fontSize: '32px', fill: '#A2D187' });

        distanceText = game.add.text(200, 20, 'Distance: 0', { fontSize: '32px', fill: '#A2D187' });

        powerText = game.add.text(450, 20, 'Power: 0', {fontSize: '32px', fill: '#A2D187'});

        statusText = game.add.text((game.world.width / 2) - 250, (game.world.height / 2) - 16, "", { fontSize: '100px', fill: '#070F00' });

        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createShooter, this);
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createSeeker, this);
        game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.createStar, this);
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createShooter, this);

        bullets = game.add.group()
        bullets.enableBody = true;

        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.Z]);
        game.world.setBounds(-20, 20, game.width + 20, game.height + 20);
        this.unPause();
        distance = winDistance;
    },

    update : function() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(bodies, platforms);
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
        player = game.add.sprite(32, game.world.height - 150, 'jetpackDog');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        return player;
    },

    initGround : function(){
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
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
        player.body.velocity.x = 0;
        
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            player.body.gravity.y = -500;
            if(gameOver){
                this.resetScene();
                game.state.start('play');
            }

        }
        else
        {
            if(!gameOver){
                player.body.gravity.y = 350;
            }
        }

        if(game.input.keyboard.isDown(Phaser.Keyboard.Z)){
            this.fireBullet();
        }
        else{
            bulletCounter = 0;
        }

        if(game.input.keyboard.isDown(Phaser.Keyboard.X)){
            this.perfMeleeAttack(player);
            inMelee = true;
        }
        else{
            inMelee = false;
        }

        if(distance <= 0){
            statusText.text = "You Won!";
            game.state.start('winScreen');
        }
        else
        {
            if(!gameOver){
                distance -= 0.1;
                distanceText.text = 'Distance: ' + Math.floor(distance);
            }
        }


    },

    collectStar : function(bullet, star){
        hitsound.play();
        star.health -= 1;
        star.x += 3;
        this.hitFlash(star);
        bullet.kill();
        hitCounter++;
        if(star.health <= 0){
            this.particleBurst(star);
            if(game.rnd.integerInRange(0, 3) == 3){
                this.hitExplosion(star);
                explosionSound.play();
                this.harlemShake();
            }
            if(game.rnd.integerInRange(0, 4) == 3){
                this.createPowerUp(star);
            }
            this.makeBody(star);
            star.kill();
            score += 10;
            scoreText.text = 'Score: ' + score;
            this.game.physics.arcade.isPaused = true;
            this.game.time.events.add(40, this.unPause, this);
        }
    },

    enemyHitByMelee : function(enemy){
        enemy.health = 0;
        this.particleBurst(enemy);
        this.makeBody(enemy);
        enemy.kill();
    },

    playerHit : function(player, star){
        if(!inMelee){
            this.particleBurst(player);
            this.hitExplosion(player);
            this.slowMo();
        }
        else{
            this.enemyHitByMelee(star);
        }

        //player.kill();

    },

    createStar : function(){
        var star = stars.create(game.world.width, game.rnd.integerInRange(64, game.world.height - 64), 'Enemy1');
        star.health = 3;
        star.body.velocity.x = -200;
    },

    createSeeker: function(){
        var seeker = stars.create(game.world.width, game.rnd.integerInRange(64, game.world.height - 64), 'Enemy3');
        seeker.health = 3;
        this.game.physics.arcade.moveToObject(seeker, player, 400);
    },

    createShooter: function(){
        var shooter = creepers.create(game.world.width, game.rnd.integerInRange(64, game.world.height - 64), 'Enemy2');
        shooter.health = 3;
        shooter.body.velocity.x = -100;
        shooter.bulletCounter = 0;
        shooter.bulletTimer = 1;
    },

    updateShooter: function(enemy){
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
        if(bulletCounter <= 0 && !gameOver){
            this.cameraShake();
            gunshot.play();
            var bullet = bullets.create(player.x + 32, player.y + 15 + (game.rnd.integerInRange(-5, 5)), 'bullet');
            bullet.body.velocity.x = 800;
            bullet.body.velocity.y = player.body.velocity.y; 
            bullet.outOfBoundsKill = true;
            bullet.body.gravity.y = game.rnd.integerInRange(-100,100);
            bulletCounter = bulletTimer;
            this.muzzleFlash(player);
            bulletsFired ++;
        }
        bulletCounter -= 0.1;
    },

    perfMeleeAttack : function(player){
        explosionSound.play();
        this.harlemShake();
        this.muzzleFlash(player);

    },

    collectPowerup : function(player, powerup){
        powerup.kill();
        powerLevel += 1;
        powerText.text = "Power: " + powerLevel;
    },

    resetScene : function(){
        score = 0;
        distance = winDistance;
        powerLevel = 0;
        gameOver = false;
        this.game.time.slowMotion = 1.0;
    },

    particleBurst : function(pointer) {
        var particles = this.makeEmitter();

        particles.x = pointer.x;
        particles.y = pointer.y;
        particles.start(true, 4000, null, 10);

        this.game.time.events.add(2000, this.destroyEmitter, this, particles);

    },

    muzzleFlash : function(position){
        var flashParticles = this.makeFlash();
        flashParticles.x = position.x + 32;
        flashParticles.y = position.y + 15;
        flashParticles.start(true, 4000, null, 2);

        this.game.time.events.add(100, this.destroyEmitter, this, flashParticles);
    },

    hitFlash : function(position){
        var flashParts = this.makeFlash();
        flashParts.x = position.x;
        flashParts.y = position.y;
        flashParts.start(true, 4000, null, 1);

        this.game.time.events.add(100, this.destroyEmitter, this, flashParts);
    },

    hitExplosion : function(position){
        var explosion = this.makeExplosion();
        explosion.x = position.x;
        explosion.y = position.y;
        explosion.start(true, 4000, null, 4);
        this.game.time.events.add(200, this.destroyEmitter, this, explosion);
    },

    destroyEmitter : function(inEmitter){
        inEmitter.destroy();
    },

    makeEmitter : function () {
        emitter = game.add.emitter(0, 0, 100);
        emitter.makeParticles('debris');
        emitter.gravity = 200;
        return emitter;
    },

    makeFlash : function(){
        flash = game.add.emitter(0,0,100);
        flash.makeParticles('flash');
        flash.gravity = 0;
        return flash;
    },    

    makeExplosion : function(){
        flash = game.add.emitter(0,0,100);
        flash.makeParticles('lgboom');
        flash.gravity = 0;
        return flash;
    },

    cameraShake : function(){
        this.game.camera.x += game.rnd.integerInRange(-2,2);
        this.game.camera.y += game.rnd.integerInRange(-2,2);
        this.game.time.events.add(100, this.resetCamera, this);
    },    

    harlemShake : function(){
        this.game.camera.x += game.rnd.integerInRange(-10,10);
        this.game.camera.y += game.rnd.integerInRange(-10,10);
        this.game.time.events.add(100, this.resetCamera, this);
    },

    resetCamera : function(){
        this.game.camera.x = 0;
        this.game.camera.y = 0;
    },

    unPause : function(){
        this.game.physics.arcade.isPaused = false;
    },

    slowMo : function(){
        this.game.time.slowMotion = 2.0;
        this.game.time.events.add(2000, this.resetTime, this);
    },

    resetTime: function(){
        this.game.time.slowMotion = 1.0;
        this.gameOverFunction();
    },

    gameOverFunction: function(){
        gameOver = true;
        dyingAnim = true;
        this.unPause();
        statusText.text = 'GAME OVER';
    },

    makeBody : function(object){
        var corpse = bodies.create(object.x, object.y, object.key);
        corpse.anchor.setTo(0.5, 0.5);
        corpse.angle += 180 + game.rnd.integerInRange(-10, 10);

        corpse.body.velocity.x = -80;
        corpse.body.gravity.y = 400;
        corpse.body.bounce.set(0.3);
        corpse.outOfBoundsKill = true;
    }

};
