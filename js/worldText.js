state.worldText = function (game){

};

state.worldText.prototype = {

    preload: function(){
	this.load.audio('thriller',['assets/audio/thriller.mp3']);

    },
    
    create: function(){
	this.introText = this.add.text(this.world.centerX - 300, this.world.height/5,"",{size: "32px", fill:"#FFF", align: "center"});
	
	this.introText.anchor.setTo(0.5,0.5);
	this.changeText;

    },
    
    update: function(){
	if(this.input.activePointer.isDown){
	   this.introText.setText("Well I go."); 
	    this.time.events.add(Phaser.Timer.SECOND*3,this.startGame,this);
	}

    },
    
    changeText: function(){
	this.introText.setText("She wasn't in the city..\nMaybe shes in another part of the world?");
    },
    
    startGame: function(){

	this.state.start('world2');

    }

}
