BasicGame.Level4 = function (game) {

};

	var map;
	var backgroundLayer;
	var fringeLayer;
	var collisionLayer;

	var death;
BasicGame.Level4.prototype = {
	create: function () {
		this.stage.backgroundColor = '#8000F0';
		map = this.add.tilemap('map'+ levelID);
		map.addTilesetImage('scraps_bricks', 'bricks');

		createPlatformer(this);
		background_music = this.add.sound('underground_music');
		background_music.play('',0,1,true,true);

	},
	update: function () {
		// Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		updatePlatformer(this);
		if(coins.total === 0){
			var leprechaun = this.add.sprite(player.x, player.y, 'leprechaun');
			leprechaun.anchor.x=player.anchor.x;
			leprechaun.anchor.y=player.anchor.y;
			player.kill();
		}
	},
	quitGame: function (pointer) {
		// Here you should destroy anything you no longer need.
		// Stop music, delete sprites, purge caches, free resources, all that good stuff.
		// Then let's go back to the main menu.
	this.state.start('MainMenu');
	}
};
