'use strict';


var game = new Phaser.Game(900, 675, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

function preload() {

game.load.audio('music',['assets/audio/calvin_harris_school.mp3']);
game.load.audio('jump',['assets/audio/mario_jump.mp3']);
game.load.image('sky', 'assets/sky.png');
game.load.image('ground','assets/platform.png');    
game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

var player;
var enemy;
var keys = Phaser.Keyboard;
var platforms;
var cursors;
var cats;
var music;
var jump;
var isDead = false;

function create(){
    music = game.add.audio('music');
    music.volume = 0.3;
    music.loop = true;
    music.play();
    jump = game.add.audio('jump');
    
    //Physics time!
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //The background
    game.add.sprite(0,0,'sky');
    
    game.world.setBounds(0,0, 1400, 675);
    
    //adding platforms and it's physics
    platforms = game.add.group();
    platforms.enableBody = true;
   
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //Scale it to fit the game width and such
    ground.scale.setTo(3,3);
    ground.body.immovable = true;
    
    //Ledge time
    var ledge = platforms.create(450, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(450, 150, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(300, 150, 'ground');
    ledge.body.immovable = true;
    
    //Making them players
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
   
    player.body.bounce.y = 0.2;
    player.body.gravity.y  = 400;
    player.body.collideWorldBounds = true;
    
    //Adding their animations
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    cursors = game.input.keyboard.createCursorKeys();

    player.anchor.setTo(0.5,0.5);
    game.camera.follow(player);
//    lockOnFollow();

}

function update(){
    //Constantly update them game physics doe
    game.physics.arcade.collide(player, platforms);
    
    
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
    }
    
    //Jump functions
    if (cursors.up.isDown && player.body.touching.down)
    {
	jump.volume = 0.5;
	jump.play();
	player.body.velocity.y = -425;


    }
    
    game.world.wrap(player, 0, true);
    

}

function lockOnFollow() {
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
}
