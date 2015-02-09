'use strict';


var game = new Phaser.Game(900, 675, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

function preload() {

game.load.audio('music',['assets/audio/calvin_harris_school.mp3']);
game.load.image('sky',['assets/sky.png']);
game.load.image('ground',['assets/platform.png']);    
game.load.image('dude',['assets/dude.png']);

}

function create(){

}

function update(){

}
