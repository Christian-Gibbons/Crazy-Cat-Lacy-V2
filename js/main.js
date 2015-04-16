var cursors;
var jumpButton;

var player;
var playerDirection;
var playerStart;

var coins;
var coin_sound;

var background_music;

var jump_sound;
var death_sound;

var levelID =1;

function initPlayer(game){
	playerStart = findObjectsByType('playerStart', map, 'Objects');
	player = game.add.sprite(playerStart[0].x + 8, playerStart[0].y+9, 'player');
	player.anchor.setTo(0.5,0.5);

	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.0;
	player.body.gravity.y = 600;
	player.body.collideWorldBounds = true;
	player.body.height = 26;
	player.body.width = 18;
	player.body.maxVelocity.x = 200;

	//add animation here
	player.animations.add('walk_right', [12, 13, 14, 15, 16, 17,], 10, true);
	player.animations.add('walk_left', [6, 7, 8, 9, 10, 11], 10, true);
	player.animations.add('idle_right', [2, 3], 20, true);
	player.animations.add('idle_left', [0, 1], 20, true);
	player.animations.add('walk_up', [0, 1, 2], 10, true);
	player.animations.add('walk_down', [18, 19, 20], 10, true);

	playerDirection = 'right';
	jump_sound = game.add.audio('jump_sound');
	death_sound = game.add.audio('death_sound');
}

function initCoins(game){
	coins = populateGroup('coin', game);
	coins.setAll('enableBody', true);
	coins.setAll('physicsBodyType', Phaser.Physics.ARCADE);
	coins.callAll('animations.add', 'animations', 'spin', [0,1,2,3,4,5], 10, true);
	coins.setAll('anchor.x', 0.5);
	coins.setAll('anchor.y', 0.5);
	coins.setAll('height', 10);
	coins.setAll('width', 9);

	coin_sound = game.add.audio('collect_coin');
}

function killCoin(player, coin){
	coin_sound.play();
	coin.kill();
}
function updatePlatformer(game){
	game.physics.arcade.collide(player, collisionLayer);

	game.physics.arcade.overlap(player, death, killPlayer, null, game);
	game.physics.arcade.overlap(player, coins, killCoin, null, game);
	coins.callAll('play', null, 'spin');

	player.body.acceleration.y = 0;
	player.body.acceleration.x = 0;
	player.body.drag.y = 0;	

	if(player.body.onFloor()){
		if(player.body.velocity.x < 0){
			player.animations.play('walk_left');
		}
		else if(player.body.velocity.x > 0){
			player.animations.play('walk_right');
		}
	}
	if (cursors.left.isDown)
	{
		//  Move to the left
		if(player.body.velocity.x > 0){
			player.body.acceleration.x = -400;
		}
		else{
			player.body.acceleration.x = -200;
			playerDirection = 'left';
		}
//		if(player.body.onFloor()){
//			playerDirection = 'left';
	//		player.animations.play('walk_left');
		//}
	}
	else if (cursors.right.isDown)
	{
		//  Move to the right
		if(player.body.velocity.x < 0){
			player.body.acceleration.x = 400;

		}
		else{
			player.body.acceleration.x = 200;
			playerDirection = 'right';
		}
//		if(player.body.onFloor()){
//			playerDirection = 'right';
	//		player.animations.play('walk_right');
		//}
	}
	else{
		 if(player.body.onFloor()){
			player.body.drag.x = 300;
		}
		else{
			player.body.drag.x = 150;
		}
	}
	if(player.body.velocity.x ===0){
		player.animations.play('idle_left');
		if(playerDirection === 'right'){
			player.animations.play('idle_right');
		}
	}

	// Allow player to jump if they are touching the ground.
	if (jumpButton.isDown)
	{
 		if(player.body.onFloor()){
			player.body.velocity.y = -400;
			jump_sound.play();

		}
		player.animations.stop();
		player.frame = 4;
		if(playerDirection === 'right'){
			player.frame = 5;
		}
	}
	else if(player.body.velocity.y < 0){
		player.body.drag.y = 600;
	}
}

function setAdvancedCollision(collision){
	collision.layer.data.forEach(function(i){
		i.forEach(function(entry){
			entry.setCollision(entry.properties.collideLeft==='true', entry.properties.collideRight==='true', entry.properties.collideUp==='true', entry.properties.collideDown==='true');
		});
	});
}

function findObjectsByType(type, map, layer) {
	var result = new Array();
	map.objects[layer].forEach(function(element){
		if(element.properties.type === type){
			element.y -= map.tileHeight;
			result.push(element);
		}
	});
	return result;
}

function createFromTiledObject(element, group){
	var sprite = group.create(element.x, element.y, element.properties.sprite);
	Object.keys(element.properties).forEach(function(key){
		sprite[key] = element.properties[key];
	});
	sprite.height = element.height;
	sprite.width = element.width;
}

	/* 
	 * type is a string that contains the properties.type to be searched for, state should receive "this"
	 * Function returns the newly populated group.
	 */
function populateGroup(type, state){
	var thisGroup = state.add.group();
	thisGroup.enableBody = true;

	var result = findObjectsByType(type, map, 'Objects');
	result.forEach(function(element){
		createFromTiledObject(element, thisGroup);
	}, this);
	return thisGroup;
}

function killPlayer(player, death){
	console.log("dead");
	background_music.stop();
	death_sound.play();
	death_sound.onStop.add(restart_level,this);
	player.kill();


}
function restart_level(){
	map.destroy();
	this.world.setBounds(0,0,0,0);
	this.state.restart();
}

function createPlatformer(game){
		fringeLayer = map.createLayer('Fringe');
		collisionLayer = map.createLayer('Collision');
		collisionLayer.visible = false;

		game.physics.arcade.enable(collisionLayer);
		setAdvancedCollision(collisionLayer);

		fringeLayer.resizeWorld();

		death = populateGroup('death', game);
		initCoins(game);
		initPlayer(game);

		cursors = game.input.keyboard.createCursorKeys();
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		game.camera.follow(player);
		game.camera.deadzone = new Phaser.Rectangle(350,100,100,400);
}
