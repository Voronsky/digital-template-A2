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
game.load.spritesheet('cat', 'assets/Burgercat_main.png',32,40, 18);
game.load.spritesheet('baddie', 'assets/baddie.png', 32,40,4);

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
    //game.add.sprite(0, 0,'city');
    //Side scrolling background
    bgtile = game.add.tileSprite(0,0, 1340, 597, 'city');
    var bg2 = game.add.tileSprite(1341,0, 675, 900, 'street');
    var bg3 = game.add.tileSprite(2000, -100, 1096, 750, 'another-bg');
    
    game.world.setBounds(0,0, 3017, 600);
    
    //adding platforms and it's physics
    platforms = game.add.group();
    platforms.enableBody = true;
   
    var ground = platforms.create(0, game.world.height - 14, 'ground');

    //Scale it to fit the game width and such
    ground.scale.setTo(7,7);
    ground.body.immovable = true;
    
    //Ledge time
    var ledge = platforms.create(450, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(650, 150, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(300, 150, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(850, 220, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(900, 250, 'ground');
    ledge.body.immovable = true;ledge = platforms.create(650, 150, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(1100, 275, 'ground');
    ledge.body.immovable = true;ledge = platforms.create(650, 150, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(1400, 450, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(1900, 450, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(1750, 250, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(2000, 150, 'ground');
    ledge.body.immovable = true;
    //Making them players
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    //player = game.add.sprite(32, game.world.height - 150, 'cat');
    game.physics.arcade.enable(player);
   
    player.body.bounce.y = 0.2;
    player.body.gravity.y  = 400;
//    player.body.collideWorldBounds = true;
    
    //Adding their animations
   // player.animations.add('left', [0, 1, 2, 3, 4, 5], 50, true);
    //player.animations.add('right', [9, 10, 11, 12, 13], 50, true);
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    //Adding hearts
    hearts = game.add.group();
    hearts.enableBody = true;

    game.time.events.repeat(Phaser.Timer.SECOND*10, 500, createHearts, this); 
    

    //Adding enmies
    enemies = game.add.group();
    //enemies.enableBody = true;
    createEnemy();
    
    scoreText = game.add.text(16, 16, 'Score: '+ score, { fontSize: '32px', fill: '#000'});

    
    cursors = game.input.keyboard.createCursorKeys();

   // player.anchor.setTo(0.5,0.5);
    game.camera.follow(player);

}

function update(){
    //Constantly update them game physics doe
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(hearts, platforms);
    game.physics.arcade.collide(enemies, platforms);

    //adding overlap to trigger functions when they overlap
    game.physics.arcade.overlap(player, hearts, collectHearts, null, this);
    
    
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
	
	player.frame = 4;
//	player.frame = 8;
    }
    
    //Jump functions
    if (game.input.keyboard.isDown(keys.UP) && player.body.touching.down)
    {
	jump.volume = 0.5;
	jump.play();
	player.body.velocity.y = -425;


    }
    
  game.world.wrap(player, 0, true);
  //world = game.add.tileSprite(0, 0, 800, 600,'sky');
  //world.fixedToCamera = true;
  //bgtile.tilePosition.x = -1;  
    

}

function lockOnFollow() {
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
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
	enemy = enemies.create(120 * i, game.rnd.integerInRange(100, 600), 'baddie');
	game.physics.arcade.enable(enemy);
	enemy.body.gravity.y = 400;
	enemy.body.bounce.y = 0.2;

	}
    //enemies.body.gravity.y = 400;
    //enemies.body.bounce.y = 0.8;
}

function collectHearts(player, hearts) {
    
    hearts.kill();
    score+= 1;
    updateScore(parseInt(score));

}

function updateScore(score) {

    scoreText.setText("Score: " + score);
}
