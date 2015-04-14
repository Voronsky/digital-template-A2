var keys = Phaser.Keyboard;
var jumpEnable = false;
var score = 0;    

state.world2 = function (game) {

};

state.world2.prototype = {


    preload: function(){
	//18 frames
	this.load.spritesheet('mummy','assets/mummy.png',37,45,18);
	this.load.spritesheet('cat','assets/burgercat2.png',36.5,40,12);
	this.load.audio('jump',['assets/audio/mario_jump.mp3']);
	this.load.audio('thriller',['assets/audio/thriller.mp3']);
	this.load.image('heart','assets/heart.png');
	this.load.tilemap('map','assets/egypt.json',null,Phaser.Tilemap.TILED_JSON);
	this.load.image('tiles','assets/tiles/tiles3.png');
	

    },

    create: function(){

	this.jump = this.add.audio('jump');
	this.music = this.add.audio('thriller');
	this.music.volume = 0.8;
	this.music.loop = true;
	this.music.play();


	//Importing tilemap tiles
	this.map = this.add.tilemap('map');
	this.map.addTilesetImage('tiles3','tiles');
	this.layer = this.map.createLayer('maze');
	this.boundsLayer = this.map.createLayer('enemyBounds');
	this.layer.resizeWorld(); //Resize game world to layer
	
	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.arcade.enable(this.boundsLayer);

	//Importing key object from the map
	//this.doorKeys = this.add.group();
	//this.doorKeys.enableBody = true;

//	this.map.createFromObjects('key',145,'key',0,true,false,this.doorKeys);
    
	//importing artifact object
	//this.artifacts = this.add.group();
	//this.artifacts.enableBody = true;
	//this.map.createFromObjects('artifact',146,'artifact',0,true,false,this.artifacts);

	
	//We use tile indexes 44, 55 and 66
	this.map.setCollisionBetween(0,67); 
	this.map.setCollisionBetween(0,133,true,'enemyBounds'); //Is an ice cube that will check the bounds to prevent NPC from falling

	this.boundsLayer.alpha = 0;
	
	//Spawning in the player, inherting from it's parent Game
	this.player = this.add.sprite(20,0,'cat'); //Top left of maze
	this.physics.arcade.enable(this.player);
	this.player.body.bounce.y = 0.2;
	this.player.body.gravity.y = 400;
	this.player.body.collideWorldBounds = true;
	this.player.animations.add('left',[0,1,2,3,4,5],10,true);
	this.player.animations.add('right',[7,8,9,10,11],10,true);
	
	//Score stuff
	this.scoreText = this.add.text(16, 16, "Hearts: "+ score, {fontSize: '32px', fill: '#FFF'});
	
	//Adding game camera
	this.camera.follow(this.player);
	this.scoreText.fixedToCamera = true;

	//this.heartText.fixedToCamera = true;

	//Adding the enemy group
	this.enemies = this.add.group();
	this.hearts = this.add.group();
	this.hearts.enableBody = true;
	this.spawnEnemy();
	this.time.events.repeat(Phaser.Timer.SECOND*2, 500, this.createHearts, this); // repeat the callback 500 times
	this.time.events.loop(Phaser.Timer.SECOND, this.enemyMove,this);

    },

    update: function(){

	this.physics.arcade.collide(this.player, this.layer,function(){ jumpEnable = true; },null,this);
	this.physics.arcade.collide(this.hearts, this.layer);

	this.physics.arcade.collide(this.enemies, this.layer);

	this.physics.arcade.collide(this.enemies, this.boundsLayer);
	
	//Mummies can now hit the player
	this.physics.arcade.collide(this.player, this.enemies, this.playerKill, null, this);

	//this.physics.arcade.overlap(this.player, this.artifacts, this.collectArtifact, null,this);
	
	//Collision check for getting hearts
	this.physics.arcade.overlap(this.player, this.hearts, this.collectHearts,null,this);

	
	this.player.body.velocity.x = 0;


	if(this.input.keyboard.isDown(keys.LEFT)){
	    
	    this.player.animations.play('left');
	    this.player.body.velocity.x = -200;

	}
	else if(this.input.keyboard.isDown(keys.RIGHT)){
	    
	    this.player.animations.play('right');
	    this.player.body.velocity.x = 200;
	    
	} else {

	    this.player.animations.stop();
	    this.player.frame = 6;

	}
		
	//Jump
	if(this.input.keyboard.isDown(keys.UP) &&
	   jumpEnable === true){
	    
	    this.jump.volume = 0.4;
	    this.jump.play();
	    this.player.body.velocity.y = -225;
	    jumpEnable = false;
	}
	
	if(score >= 20) {

	   this.state.start('endGame'); 
	}
	

	this.updateScore(score);
    },
    
    randomHeight: function() {
	var width = 800;
	return Math.random()*(width - (this.world.height - 150) + 150);
    },

    createHearts: function() {
	var height = this.randomHeight();
	this.heart = this.hearts.create(this.world.randomX, this.rnd.integerInRange(60,this.world.height-90), 'heart');
	this.heart.body.gravity.y = 400;
	this.heart.body.bounce.y = 0.8;
    },

    spawnEnemy: function() {
	
	for (var i=0; i<20; i++) {
	    
	    this.enemy = this.enemies.create(this.world.randomX,this.rnd.integerInRange(20,this.world.height - 40),'mummy');
	    this.physics.arcade.enable(this.enemy);
	    this.enemy.body.gravity.y = 400;
	    this.enemy.body.bounce.y = 0.1;
	    this.enemy.animations.add('walk');
	}

    },

    enemyMove: function() {
	this.enemies.forEach(function(enemy) {
	  
	    //Binary decision making for enemy movement
	    var x = Math.round(Math.random());
	    if(x == 1){
		enemy.animations.play('walk',20,true);
		enemy.body.velocity.x = -100;
	    }
	    if(x == 0){

		enemy.animations.play('right',20,true);
		enemy.body.velocity.x = 100;
	    }
	    
	}, this);

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
	    this.player.reset(20, 10); // top left of the maze
	}
    },

/*    collectKey: function(player, key){

	key.kill();
	collectedKey = true;
    },*/

   /* doorBody: function(){
	this.doors.forEach(function(door) {
	    this.physics.arcade.enable(this.door);
	    this.door.body.immovable = true;
	},this);
    },*/
   /* openDoor: function(player, door){
	//console.log("works");
    },*/

    /*collectArtifact: function(player, artifact){
	artifact.kill();
	this.state.start('textScene2');
    },*/

    collectHearts: function(player, hearts) {
    
	hearts.kill();
	score+= 1;
	this.updateScore(parseInt(score));

    },

    updateScore: function(score) {
	this.scoreText.setText("Hearts: " + score);
    }

}
