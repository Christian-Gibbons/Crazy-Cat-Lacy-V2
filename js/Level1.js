BasicGame.Level1 = function (game) {

};

	var map;
	var fringeLayer;
	var collisionLayer;

	var death;

BasicGame.Level1.prototype = {
	create: function () {
		this.stage.backgroundColor = '#787878';
		map = this.add.tilemap('soviet');
		map.addTilesetImage('Post Soviet', 'tiles');
		createAction(this);
	},
	update: function () {
		updateAction(this);		

	},
	quitGame: function (pointer) {
		// Here you should destroy anything you no longer need.
		// Stop music, delete sprites, purge caches, free resources, all that good stuff.
		// Then let's go back to the main menu.
	this.state.start('MainMenu');
	}
};
