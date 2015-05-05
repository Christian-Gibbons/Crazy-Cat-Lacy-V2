
BasicGame.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};
BasicGame.Preloader.prototype = {
	preload: function () {
		this.load.tilemap('soviet', 'assets/tilemaps/maps/soviet.json', null, Phaser.Tilemap.TILED_JSON);

		this.load.image('tiles', 'assets/tilemaps/tiles/PostSovietTile.png');
		this.load.spritesheet('player', 'assets/spritesheets/sara_16x18.png', 16, 18);
		this.load.spritesheet('person', 'assets/spritesheets/Hero.png', 16, 16);
		this.load.image('kitten', 'assets/spritesheets/catsprite.png');
		this.load.image('greenAlien', 'assets/spritesheets/Alien_UFO_pack/PNG/shipGreen_manned.png');
		this.load.image('blueAlien', 'assets/spritesheets/Alien_UFO_pack/PNG/shipBlue_manned.png');
		this.load.image('pinkAlien', 'assets/spritesheets/Alien_UFO_pack/PNG/shipPink_manned.png');
		this.load.image('beigeAlien', 'assets/spritesheets/Alien_UFO_pack/PNG/shipBeige_manned.png');
		this.load.image('projectile', 'assets/spritesheets/projectile.png');
		this.load.audio('cat1', 'assets/sounds/cat/Cat 1.wav');
		this.load.audio('cat2', 'assets/sounds/cat/Cat 2.wav');
		this.load.audio('cat3', 'assets/sounds/cat/Cat 3.wav');
		this.load.audio('cat4', 'assets/sounds/cat/Cat 4.wav');
		this.load.audio('cat5', 'assets/sounds/cat/Cat 5.wav');
		this.load.audio('cat6', 'assets/sounds/cat/Cat 6.wav');
		this.load.audio('cat7', 'assets/sounds/cat/Cat 7.wav');
		this.load.audio('cat8', 'assets/sounds/cat/Cat 8.wav');
		this.load.audio('never_to_return', 'assets/music/Never_to_Return.mp3');
		this.load.audio('spinning', 'assets/music/Spinning.mp3');
		this.load.audio('death_sound', 'assets/sounds/8-Bit Sound Library/Mp3/Explosion_04.mp3');
		this.load.audio('damage_sound', 'assets/sounds/8-Bit Sound Library/Mp3/Explosion_02.mp3');

	},
	create: function () {
	// Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
//		this.preloadBar.cropEnabled = false;
	},
	update: function () {
	// You don't actually need to do this, but I find it gives a much smoother game experience.
	// Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
	// You can jump right into the menu if you want and still play the music, but you'll have a few
	// seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
	// it's best to wait for it to decode here first, then carry on.
	// If you don't have any music in your game then put the game.state.start line into the create function and delete
	// the update function completely.
/*		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}*/
		this.state.start('MainMenu');
	}
};
