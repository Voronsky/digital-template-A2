var state = {};

state.intro = function (game) {

};

state.intro.prototype = {

    preload: function(){
	//this.load.spritesheet('player','assets/guy.png',33,34,9,0.4);
	//this.load.spritesheet('dude','assets/dude.png',32,48);
	this.load.audio('music',['assets/audio/calvin_harris_school.mp3']);

    },
    create: function(){

	this.intro = this.add.text(this.world.centerX - 100, this.world.height/5,"",{size: "32px", fill:"#FFF", align: "center"}); //Setting the introduction text object

	this.intro.anchor.setTo(0.5,0.5); //Anchoring it to top center
	this.startText = this.add.text(this.world.centerX-100, this.world.height/5,"",{size: "32px", fill:"#FFF", align: "center"});
	this.startText.anchor.setTo(0.5,0.5);


	this.startScreen();
	//this.introText(); //Calling text

    },

    update: function(){

	if(this.input.activePointer.isDown){

	   this.intro.setText("Hmm, maybe shes in town?");
	    //Event delay
	    this.time.events.add(Phaser.Timer.SECOND*3,this.startGame,this);
	}
    },

    introText: function(){

	this.intro.setText("She Loves me!\nSheLoves me Not!\nShe loves me!");
	    this.time.events.add(Phaser.Timer.SECOND*3,function(){this.intro.setText("She loves me..\n I wonder where she is. I miss her\n<Click to continue>");},this);

    },
	
   startScreen: function(){
       
       this.startText.setText("Things I do for Love!");
       this.time.events.add(Phaser.Timer.SECOND*3,function(){this.startText.setText("Help the cat find his lost Love.\nWatch out for opponents\n");},this);
       this.time.events.add(Phaser.Timer.SECOND*4,function(){this.startText.setText("Find hearts to boost his energy to keep going.\nOnce you find 20 hearts you will advance to a new stage.\nDon't get hit or you will lose hearts");},this);
       this.startText.visible = false;
       this.time.events.add(Phaser.Timer.SECOND*4,this.introText,this);
							     
       
   },

    startGame: function(){

	this.state.start('main');
    }

}
