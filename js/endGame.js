state.endGame = function (game) {

};

state.endGame.prototype = {

    preload: function(){
	this.load.image('park','assets/another_bg.png');
	this.load.spritesheet('female_cat', 'assets/cat_sheet.png',54,42,11); // use 11 of them
	this.load.spritesheet('cat','assets/burgercat2.png',36.5,40,12);
    },
    
    create: function(){

	this.bgtile = this.add.tileSprite(0,-125,this.cache.getImage('park').width,this.cache.getImage('park').height,'park');
	this.world.setBounds(0,0,1096,728); //Image dimensions
	this.physics.startSystem(Phaser.Physics.ARCADE);
	//this.bgtile = this.add.tileSprite(0,0,800,600,'park');
	//this.world.setBounds(this.cache.getImage('park').width,'park',this.cache.getImage('park').height,'park'); //resize the world to the picture bounds
    
	this.player = this.add.sprite(this.world.width - 350,this.world.height-170,'cat');
	this.physics.arcade.enable(this.player);
	this.femaleNPC = this.add.sprite(30,this.world.height-225,'female_cat');
	

	//Player animations
	this.player.body.bounce.y = 0.2;
	this.player.body.gravity.y = 0;
	
	this.player.animations.add('left',[0,1,2,3,4,5],10,true);
	this.player.animations.add('right',[6,7,8,9,10,11,12],true);
	
	this.platforms = this.add.group();
	this.platforms.enableBody = true;
	this.ground = this.platforms.create(0, this.world.height - 100);
	this.ground.immovable = true;
	this.ground.scale.setTo(8,8);
	
	
	this.time.events.add(Phaser.Timer.SECOND*2,this.changeText,this);

    },
    
    update: function(){

	this.player.body.velocity.x = 0;
	this.player.animations.stop();
	this.player.frame = 5;
	
	if(this.player.x > this.world.width - 400){
	    this.player.body.velocity.x = -200;
	    this.player.animations.play('left');
	}
	
	
	
    },
    
    changeText: function(){
	this.sceneText = this.add.text(this.player.x, this.player.y - 20, "" , {size: "16px", fill:"#FFF"});
	this.sceneText.setText("!");
	this.time.events.add(Phaser.Timer.SECOND*2,function(){this.sceneText.visible = false;},this);
	this.time.events.add(Phaser.Timer.SECOND*5,function(){this.sceneText.visible = true; this.sceneText.setText("Finally found you");},this);
	this.time.events.add(Phaser.Timer.SECOND*4, function(){this.sceneText.visible = false;},this);
							     

    }
}
