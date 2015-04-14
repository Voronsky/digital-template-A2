var enemy;
var keys = Phaser.Keyboard;
var cursors;
var cats;
var score = 0;
var levelExist = false;
var isDead = false;

//var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});
state.main=function(game){

};

state.main.prototype = {
    
    preload: function () {
///	this.load.audio('music',['assets/audio/calvin_harris_school.mp3']);
	this.load.audio('jump',['assets/audio/mario_jump.mp3']);
	this.load.image('city', 'assets/just_passing_through.png');
	this.load.image('street', 'assets/street.png');
	this.load.image('ground','assets/platform.png');    
	this.load.image('another-bg','assets/another_bg.png');    
	this.load.image('heart','assets/heart.png');
	this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	this.load.spritesheet('cat', 'assets/burgercat2.png', 36.5, 40,12);
	this.load.spritesheet('baddie', 'assets/baddie.png', 32,32);

    },

    create: function(){
	
	this.music = this.add.audio('music');
	this.music.volume = 0.3;
	this.music.loop = true;
	this.music.play();
	this.jump = this.add.audio('jump');
    
	//Physics time!
	this.physics.startSystem(Phaser.Physics.ARCADE);

	//The background
	//Side scrolling background
	this.bgtile = this.add.tileSprite(0,0, 1340, 597, 'city');
    
	this.bg2 = this.add.sprite(1340,-10, 'street');
   
	//adding platforms and it's physics
	this.platforms = this.add.group();
	this.platforms.enableBody = true;
   
	this.ground = this.platforms.create(0, this.world.height - 10, 'ground');

	//Scale it to fit the game width and such
	this.ground.scale.setTo(8,8);
	this.ground.body.immovable = true;
    
	//Ledge time
	this.part1(this.platforms);

	this.player = this.add.sprite(32, this.world.height - 150, 'cat');
	this.physics.arcade.enable(this.player);
   
	this.player.body.bounce.y = 0.2;
	this.player.body.gravity.y  = 400;
	this.player.body.collideWorldBounds = true;
    
	//Adding their animations
	this.player.animations.add('left', [0, 1, 2, 3, 4, 5], 10, true);
	this.player.animations.add('right', [6, 7, 8, 9, 10, 11, 12], 10, true);
    
	//Adding hearts
	this.hearts = this.add.group();
	this.hearts.enableBody = true;

	this.time.events.repeat(Phaser.Timer.SECOND*2, 500, this.createHearts, this); 
    

	//Adding enmies
	this.enemies = this.add.group();

	//enemies.enableBody = true;
	this.createEnemy();
	
    
	this.scoreText = this.add.text(16, 16, 'Hearts: '+ score, { fontSize: '32px', fill: '#FFF'});

    

	// player.anchor.setTo(0.5,0.5);
	this.camera.follow(this.player);
	
	this.scoreText.fixedToCamera = true;
	
	//Enemy movement
	this.time.events.loop(Phaser.Timer.SECOND, this.enemyMove, this); 
    },

    update: function(){

	//Constantly update them game physics doe
	this.physics.arcade.collide(this.player, this.platforms);
	this.physics.arcade.collide(this.hearts, this.platforms);
	this.physics.arcade.collide(this.enemies, this.platforms);

	this.physics.arcade.collide(this.player, this.enemies, this.playerKill, null, this);
	
	//adding overlap to trigger functions when they overlap
	this.physics.arcade.overlap(this.player, this.hearts, this.collectHearts, null, this);

    
	this.player.body.velocity.x = 0;

	if (this.input.keyboard.isDown(keys.LEFT)){
	    this.player.body.velocity.x = -175;
	    this.player.animations.play('left');
	}
	else if (this.input.keyboard.isDown(keys.RIGHT)){
	    this.player.body.velocity.x = 175;
	    this.player.animations.play('right');
	} else {
	    this.player.animations.stop();
	
	    this.player.frame = 6;
	}
    
	//Jump functions
	if (this.input.keyboard.isDown(keys.UP) && this.player.body.touching.down)
	{
	    this.jump.volume = 0.5;
	    this.jump.play();
	    this.player.body.velocity.y = -425;
	}
    
	if(score >= 20 && levelExist == false) 
	{
	    this.part2(this.platforms);
	    levelExist = true;
	}
	if(score >= 40)
	{
	    this.state.start("worldText");
	}


	this.updateScore(score);
    },

    part1: function(platforms) {

	//    bgtile = game.add.tileSprite(0,0, 1340, 597, 'city');
	this.world.setBounds(0,0, 1340, 597);

	this.ledge = this.platforms.create(350, 400, 'ground');
	this.ledge.body.immovable = true;

	this.ledge = this.platforms.create(650, 250, 'ground');
	this.ledge.body.immovable = true;

	this.ledge = this.platforms.create(200, 150, 'ground');
	this.ledge.body.immovable = true;
    

    },

    part2: function(platforms) {

	this.world.setBounds(0, 0, 2010, 597);

	this.ledge = this.platforms.create(1100, 225, 'ground');
	this.ledge.body.immovable = true;

	this.ledge = this.platforms.create(1400, 195, 'ground');
	this.ledge.body.immovable = true;

	this.ledge = this.platforms.create(1900, 350, 'ground');
	this.ledge.body.immovable = true;
    },



    randomHeight: function() {
	var width = 800;
	return Math.random()*(width - (this.world.height - 150) + 150);
    },

    createHearts: function() {
	var height = this.randomHeight();
	this.heart = this.hearts.create(this.world.randomX, height, 'heart');
	this.heart.body.gravity.y = 400;
	this.heart.body.bounce.y = 0.8;
    },

    //Sprites of enemies
    createEnemy: function() {
	for (var i=0; i<4; i++) {
	    this.enemy = this.enemies.create(this.world.randomX, this.rnd.integerInRange(100,600), 'baddie');
	    this.physics.arcade.enable(this.enemy);
	    this.enemy.body.gravity.y = 400;
	    this.enemy.body.bounce.y = 0.2;
	    this.enemy.animations.add('left',[0,1], 10, true);
	    this.enemy.animations.add('right',[2,3],10,true);
	    this.enemy.body.collideWorldBounds = true;
	}

    },

    playerKill: function(player, enemies) {
	score-=1;
	this.updateScore(parseInt(score));
	this.player.x = this.player.x-20;
	this.player.y = this.player.y-10;


	if(score <= 0) 
	{
	    //player.kill();
	    score = 0;
	    this.player.reset(32, this.world.height - 150);
	}
    },
    enemyMove: function() {
	this.enemies.forEach(function(enemy) {
	    var x = Math.round(Math.random());
	    if(x == 1)
	    {
		if(enemy.body.touching.down)
		{
		    enemy.body.velocity.y = -400;
		}
		enemy.animations.play('left');
		enemy.body.velocity.x = -150;
		
	    }
	    if(x == 0)
	    {
		if(enemy.body.touching.down)
		{
		    enemy.body.velocity.y = -400;
		}
		enemy.animations.play('right');
		enemy.body.velocity.x = 150;
	    }
	}, this);
    },

    collectHearts: function(player, hearts) {
    
	hearts.kill();
	score+= 1;
	this.updateScore(parseInt(score));

    },

    updateScore: function(score) {
	this.scoreText.setText("Hearts: " + score);
    }

}
