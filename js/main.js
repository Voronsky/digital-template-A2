'use strict';


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});

function preload() {

game.load.audio('music',['assets/audio/calvin_harris_school.mp3']);
game.load.audio('jump',['assets/audio/mario_jump.mp3']);
game.load.image('city', 'assets/just_passing_through.png');
game.load.image('street', 'assets/street.png');
game.load.image('ground','assets/platform.png');    
game.load.image('another-bg','assets/another_bg.png');    
game.load.image('heart','assets/heart.png');
game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
//game.load.spritesheet('cat', 'assets/Burgercat_main.png',32,40, 14);
game.load.spritesheet('cat', 'assets/burgercat2.png', 36.5, 40,12);
game.load.spritesheet('baddie', 'assets/baddie.png', 32,32);

}

var player;
var enemy;
var keys = Phaser.Keyboard;
var platforms;
var cursors;
var cats;
var music;
var jump;
var world;
var hearts;
var enemy;
var enemies;
var scoreText;
var score = 0;
var levelExist = false;
var isDead = false;
var bgtile;

function create(){
    music = game.add.audio('music');
    music.volume = 0.3;
    music.loop = true;
    music.play();
    jump = game.add.audio('jump');
    
    //Physics time!
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //The background
    //Side scrolling background
    bgtile = game.add.tileSprite(0,0, 1340, 597, 'city');
    
    var bg2 = game.add.sprite(1340,-10, 'street');
   
    //adding platforms and it's physics
    platforms = game.add.group();
    platforms.enableBody = true;
   
    var ground = platforms.create(0, game.world.height - 10, 'ground');

    //Scale it to fit the game width and such
    ground.scale.setTo(8,8);
    ground.body.immovable = true;
    
    //Ledge time
   // makePlatforms();
    part1(platforms);

    //Making them players
 //   player = game.add.sprite(32, game.world.height - 150, 'dude');
    player = game.add.sprite(32, game.world.height - 150, 'cat');
    game.physics.arcade.enable(player);
   
    player.body.bounce.y = 0.2;
    player.body.gravity.y  = 400;
    player.body.collideWorldBounds = true;
    
    //Adding their animations
    player.animations.add('left', [0, 1, 2, 3, 4, 5], 10, true);
    player.animations.add('right', [6, 7, 8, 9, 10, 11, 12], 10, true);
   // player.animations.add('left', [0, 1, 2, 3], 10, true);
   // player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    //Adding hearts
    hearts = game.add.group();
    hearts.enableBody = true;

    game.time.events.repeat(Phaser.Timer.SECOND*2, 500, createHearts, this); 
    

    //Adding enmies
    enemies = game.add.group();
    //enemies.enableBody = true;
    createEnemy();
    
    scoreText = game.add.text(16, 16, 'Hearts: '+ score, { fontSize: '32px', fill: '#000'});

    

   // player.anchor.setTo(0.5,0.5);
    game.camera.follow(player);
   game.time.events.loop(Phaser.Timer.SECOND, enemyMove, this); 
}

function update(){
    //Constantly update them game physics doe
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(hearts, platforms);
    game.physics.arcade.collide(enemies, platforms);

    //adding overlap to trigger functions when they overlap
    game.physics.arcade.overlap(player, hearts, collectHearts, null, this);
    game.physics.arcade.overlap(player, enemies, playerKill, null, this);
    
    player.body.velocity.x = 0;

    if (game.input.keyboard.isDown(keys.LEFT))
    {
	player.body.velocity.x = -175;
	player.animations.play('left');
    }
    else if (game.input.keyboard.isDown(keys.RIGHT))
    {
	player.body.velocity.x = 175;
	player.animations.play('right');
    }
    else
    {
	player.animations.stop();
	
	player.frame = 6;
    }
    
    //Jump functions
    if (game.input.keyboard.isDown(keys.UP) && player.body.touching.down)
    {
	jump.volume = 0.5;
	jump.play();
	player.body.velocity.y = -425;


    }
    
    if(score == 20 && levelExist == false) 
    {

	part2(platforms);
	levelExist = true;
    }

  /* enemies.forEach(function(enemy) {
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
   }, this);*///enemies.forEach(enemyMove,game.physics, false, 200);
    updateScore(score);
}

function lockOnFollow() {
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
}

function part1(platforms) {

//    bgtile = game.add.tileSprite(0,0, 1340, 597, 'city');
    game.world.setBounds(0,0, 1340, 597);

    var ledge = platforms.create(350, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(650, 250, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(200, 150, 'ground');
    ledge.body.immovable = true;
    

}

function part2(platforms) {

    game.world.setBounds(0, 0, 2010, 597);
    var ledge = platforms.create(1100, 225, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(1400, 195, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(1900, 350, 'ground');
    ledge.body.immovable = true;
}



function randomHeight() {
    var width = 800;
    return Math.random()*(width - (game.world.height - 150) + 150);
}

function createHearts() {
    var y = randomHeight();
    var heart = hearts.create(game.world.randomX, y, 'heart');
    heart.body.gravity.y = 400;
    heart.body.bounce.y = 0.8;
}

//Sprites of enemies
function createEnemy() {

    for (var i=0; i<6; i++) {
	enemy = enemies.create(game.world.randomX, game.rnd.integerInRange(100, 600), 'baddie');
	game.physics.arcade.enable(enemy);
	enemy.body.gravity.y = 400;
	enemy.body.bounce.y = 0.2;
	enemy.animations.add('left',[0,1],10,true);
	enemy.animations.add('right',[2, 3], 10, true);
	enemy.body.collideWorldBounds = true;
	}
}

function playerKill(player, enemies) {

    score-=1;
    updateScore(parseInt(score));
    if(score <= 0) 
    {
	//player.kill();
	score = 0;
	player.reset(32, game.world.height - 150);
    }
}

function enemyMove ()
    {
	enemies.forEach(function(enemy) {
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
    }



function collectHearts(player, hearts) {
    
    hearts.kill();
    score+= 1;
    updateScore(parseInt(score));

}



function updateScore(score) {
    scoreText.setText("Hearts: " + score);
}
