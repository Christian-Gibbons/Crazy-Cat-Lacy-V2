var player;
var kittens;
var kitten;
var throwTime = 0;
var meows = [];
var people;
var person;

//var greenAliens;
var projectiles;
var projectileSpeed = 100;
var cursors;
var jumpButton;
var playerDirection;

var bossAppeared;

var background_music;
var death_sound;

var time;
var display;
var gameOver = 0;

function initPlayer(game){
	playerStart = findObjectsByType('playerStart', map, 'Objects');
	player = game.add.sprite(playerStart[0].x, playerStart[0].y, 'player');
	player.anchor.setTo(0.5,0.5);

	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.0;
	player.body.gravity.y = 800;
	player.body.collideWorldBounds = true;

	player.animations.add('walk_right', [9, 10, 11], 10, true);
	player.animations.add('walk_left', [27, 28, 29], 10, true);
	player.animations.add('throw_right', [15, 12, 9], 6, false);
	player.animations.add('throw_left', [33, 30, 27], 6, false);

	playerDirection = 'right';

	kittens = game.add.group();
	kittens.enableBody = true;
	kittens.physicsBodyType = Phaser.Physics.ARCADE;
	kittens.createMultiple(30, 'kitten');
	kittens.setAll('anchor.x', 0.5);
	kittens.setAll('anchor.y', 0.5);
	kittens.setAll('outOfBoundsKill', true);
	kittens.setAll('checkWorldBounds', true);
	kittens.setAll('body.gravity.y', 400);

	projectiles = game.add.group();
	projectiles.enableBody = true;
	projectiles.physicsBodyType = Phaser.Physics.ARCADE;
	projectiles.createMultiple(30, 'projectile');
	projectiles.setAll('anchor.x', 0.5);
	projectiles.setAll('anchor.y', 0.5);
	projectiles.setAll('outOfBoundsKill', true);
	projectiles.setAll('checkWorldBounds', true);
	
}

function initAliens(game){
	greenAliens = populateGroup('greenAlien', game);
	greenAliens.setAll('height', 32);
	greenAliens.setAll('width', 32);
	greenAliens.setAll('enableBody', true);
	greenAliens.setAll('physicsBodyType', Phaser.Physics.ARCADE);
	greenAliens.setAll('anchor.x', 0.5);
	greenAliens.setAll('anchor.y', 0.5);
	greenAliens.setAll('body.maxVelocity.y', 150);
	greenAliens.setAll('wasInCamera', false);

	blueAliens = populateGroup('blueAlien', game);
	blueAliens.setAll('height', 32);
	blueAliens.setAll('width', 32);
	blueAliens.setAll('enableBody', true);
	blueAliens.setAll('physicsBodyType', Phaser.Physics.ARCADE);
	blueAliens.setAll('anchor.x', 0.5);
	blueAliens.setAll('anchor.y', 0.5);

	pinkAliens = populateGroup('pinkAlien', game);
	pinkAliens.setAll('height', 32);
	pinkAliens.setAll('width', 32);
	pinkAliens.setAll('enableBody', true);
	pinkAliens.setAll('physicsBodyType', Phaser.Physics.ARCADE);
	pinkAliens.setAll('anchor.x', 0.5);
	pinkAliens.setAll('anchor.y', 0.5);
	pinkAliens.setAll('body.maxVelocity.x', 150);
	pinkAliens.setAll('wasInCamera', false);


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

function updatePlayer(game){
	if(player.body.onFloor()){
		player.body.velocity.x = 0;
	}
	if (cursors.up.isDown)
	{
		if(game.time.now > throwTime){
			if(playerDirection === 'right'){
				player.animations.play('throw_right',null, false);
			}
			else{
				player.animations.play('throw_left', null, false);
			}
			throwKitten(game);
		}
	}
//	else if (cursors.left.isDown && player.body.onFloor())
	else if (cursors.left.isDown)
	{
		//  Move to the left
		playerDirection = 'left';
		player.body.velocity.x = -150;

//			player.scale.x = 1;
//			if(player.body.onFloor()){
			player.animations.play('walk_left');
//			}
//			else{
//				player.animations.stop();
//				player.frame = 0; 
//			}
	}
//	else if (cursors.right.isDown && player.body.onFloor())
	else if (cursors.right.isDown)
	{
		//  Move to the right
		player.body.velocity.x = 150;
		playerDirection = 'right';
//			player.scale.x = -1;
//			if(player.body.onFloor()){
			player.animations.play('walk_right');
//			}
//			else{
//				player.animations.stop();
//				player.frame = 0; 
//			}
	}

	else
	{
		if(!(player.animations.currentAnim === player.animations.getAnimation('throw_right'))||(player.animations.currentAnim === player.animations.getAnimation('throw_left'))){
			
			player.animations.stop();
			player.frame = 27;
			if(playerDirection === 'right'){
				player.frame = 9;
			}
		}
	}
	// Allow player to jump if they are touching the ground.
	if (jumpButton.isDown && player.body.onFloor())
	{
		player.body.velocity.y = -300;
	}
}

function updateAliens(game){
	updateGreenAliens(game);
	updateBlueAliens(game);
	updatePinkAliens(game);
	updateBeigeAliens(game);
}

function updateGreenAliens(game){
	greenAliens.children.forEach(function(entry){
		if(entry.inCamera && entry.exists){
			if(entry.x < game.camera.x){
				entry.body.velocity.x = 75;
			}
			if(entry.x+entry.width > game.camera.x + 800){
				entry.body.velocity.x = -75;
			}
			if(!entry.wasInCamera){
				entry.wasInCamera = true;
				entry.body.velocity.y = entry.body.maxVelocity.y;
				entry.shotTime = game.time.now;
				entry.body.velocity.x = -75;
			}
//			entry.body.velocity.x = -100;
			if(entry.body.velocity.y === entry.body.maxVelocity.y){
				entry.body.acceleration.y = -400;
			}
			else if(entry.body.velocity.y === -entry.body.maxVelocity.y){
				entry.body.acceleration.y = 400;
			}
			if(game.time.now > entry.shotTime){
				var gun = {};
//				gun.x = entry.x+entry.width/2;
//				gun.y = entry.y + entry.height;
				gun.x = entry.x;
				gun.y = entry.y + entry.height/2;				
				var polDif = getPolarDifference(gun,player);
				var projectile = projectiles.getFirstExists(false);
//				var projectileSpeed = 200;
				if(projectile){
					projectile.reset(gun.x, gun.y);
					projectile.body.velocity.x = projectileSpeed * Math.cos(polDif.angle);
					projectile.body.velocity.y = projectileSpeed * -Math.sin(polDif.angle);
				}
				entry.shotTime = game.time.now + 2500;
			}
		}
		else{
			entry.wasInCamera = false;
			entry.body.velocity.y = 0;
			entry.body.velocity.x = 0;
		}
		
	});
}

function updateBlueAliens(game){
	blueAliens.children.forEach(function(entry){
		if(entry.inCamera && entry.exists){
			if(!entry.wasInCamera){
				entry.wasInCamera = true;
				entry.shotTime = game.time.now;
			}
			if(game.time.now > entry.shotTime){
				var gun = {};
//				gun.x = entry.x + entry.width/2;
//				gun.y = entry.y + entry.height;
				gun.x = entry.x;
				gun.y = entry.y + entry.height/2;
				var polDif = getPolarDifference(gun,player);
				var projectile = projectiles.getFirstExists(false);
//				var projectileSpeed = 200;
				if(projectile){
					projectile.reset(gun.x,gun.y);
					projectile.body.velocity.x = projectileSpeed * Math.cos(polDif.angle);
					projectile.body.velocity.y = projectileSpeed * -Math.sin(polDif.angle);
				}
				entry.shotTime = game.time.now + 1500;
			}
		}
		else{
			entry.wasInCamera = false;
		}
	});
}

function updatePinkAliens(game){
	pinkAliens.children.forEach(function(entry){
		if(entry.inCamera && entry.exists){
			if(!entry.wasInCamera){
				entry.wasInCamera = true;
				entry.shotTime = game.time.now;
				entry.body.velocity.x = entry.body.maxVelocity.x;
			}
			if(entry.body.velocity.x === entry.body.maxVelocity.x){
				entry.body.acceleration.x = -200;
			}
			else if(entry.body.velocity.x === -entry.body.maxVelocity.x){
				entry.body.acceleration.x = 200;
			}
			if(game.time.now > entry.shotTime){
				var gun = {};
				var playerPlus = {};
				gun.x = entry.x;
				gun.y = entry.y + entry.height/2;
				playerPlus.x = player.x + 48;
				playerPlus.y = player.y;
				var polDif = getPolarDifference(gun,playerPlus);
				var projectile = projectiles.getFirstExists(false);
//				projectileSpeed = 150;
				if(projectile){
					projectile.reset(gun.x, gun.y);
					projectile.body.velocity.x = projectileSpeed * Math.cos(polDif.angle);
					projectile.body.velocity.y = projectileSpeed * -Math.sin(polDif.angle);
				}
				entry.shotTime = game.time.now + 1750;
			}
		}
		else{
			entry.wasInCamera = false;
		}
	});
}

function updateBeigeAliens(game){

}

function killPlayer(player, death){
	console.log("dead");
	background_music.stop();
	player.kill();
	death_sound.play();
	death_sound.onStop.add(restart_level,this);

//	restart_level();
}

function restart_level(){
	map.destroy();
	this.world.setBounds(0,0,0,0);
	this.state.restart();
}

function createAction(game){

	fringeLayer = map.createLayer('background');
	collisionLayer = map.createLayer('collision');

	fringeLayer.resizeWorld();
	collisionLayer.visible = false;

	game.physics.arcade.enable(collisionLayer);
	map.setCollisionByExclusion([],true,collisionLayer);
	background_music = game.add.audio('never_to_return');
	background_music.play('',0,1,true,true);
	death_sound = game.add.audio('death_sound');
	for(var i=1; i<=8; i++){
		meows.push(game.add.audio('cat' + i));
	}

	initPlayer(game);
	initAliens(game);

	bossAppeared = false;

	cursors = game.input.keyboard.createCursorKeys();
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	game.camera.follow(player);
	game.camera.deadzone = new Phaser.Rectangle(3*800/7,100,800/7,400);
}

function throwKitten(game){
	if(game.time.now > throwTime){
		kitten = kittens.getFirstExists(false);
		if(kitten){
			var rand = Math.floor((Math.random() * 16));
			if(rand <8){
				meows[rand].play();
			}
			if(playerDirection === 'left'){
				kitten.reset(player.x - 8, player.y -9);
//				kitten.body.velocity.x = player.body.velocity.x -250;
				kitten.body.velocity.x = player.body.velocity.x -200;
			}
			else{
				kitten.reset(player.x + 8, player.y -9);
//				kitten.body.velocity.x = player.body.velocity.x + 250;
				kitten.body.velocity.x = player.body.velocity.x + 200;
			}
//			kitten.body.velocity.y = player.body.velocity.y -120;
			kitten.body.velocity.y = player.body.velocity.y - 75;
			throwTime = game.time.now + 500;
		}
	}
}

function getPolarDifference(object1, object2){
	var displacement = {};
	var ret = {};
	displacement.x = object2.x - object1.x;
	displacement.y = object1.y - object2.y; //game world exists in quadrant 4
	displacement.abs = Math.sqrt((displacement.x*displacement.x)+(displacement.y*displacement.y));
	ret.displacement = displacement.abs;
	ret.angle = Math.atan2((displacement.y),(displacement.x));
	return ret;
}

function updateAction(game){
	game.physics.arcade.collide(player, collisionLayer);
	game.physics.arcade.overlap(player, projectiles, killPlayer, null, game);
	game.physics.arcade.overlap(kittens, greenAliens, hurtAlien, null, game);
	game.physics.arcade.overlap(kittens, blueAliens, hurtAlien, null, game);
	game.physics.arcade.overlap(kittens, pinkAliens, hurtAlien, null, game);
	updatePlayer(game);
	updateAliens(game);

	if(!bossAppeared){
		if(blueAliens.total + greenAliens.total + pinkAliens.total === 0){
			bossAppeared = true;
			beigeAliens = populateGroup('beigeAlien', game);
			beigeAliens.setAll('height', 128);
			beigeAliens.setAll('width', 128);
			beigeAliens.setAll('enableBody', true);
			beigeAliens.setAll('physicsBodyType', Phaser.Physics.ARCADE);
			beigeAliens.setAll('anchor.x', 0.5);
			beigeAliens.setAll('anchor.y', 0.5);
			beigeAliens.setAll('wasInCamera', false);
			background_music.stop();
			background_music = game.add.audio('spinning');
			background_music.play('',0,1,true,true);
		}
	}	
}

function hurtAlien(kitten, alien){
	kitten.kill();
	alien.kill();
}
