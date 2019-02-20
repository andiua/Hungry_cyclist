class Game {
	constructor(game) { }
	create() {
		this.speed = 3.5;
		this.gravitation = 250;
		this.bombCount = 0;
		this.bananasCount = 0;
		
		// world
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.checkCollision.down = false;
		this.phJson = this.game.cache.getJSON('level:1');
		this.bg = game.add.tileSprite(0, 0, 800, 600, "jungle");	
		this.cursors = game.input.keyboard.createCursorKeys();
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 

		// inticialization objects
		// floor
		this.earth();
		this.cyclist = this.game.add.sprite(20, this.game.world.height-70, 'cyclist');
		this.cyclist.anchor.set(0,1);
		this.cyclist.animations.add('ride', [0,1,2,3,4,5,6,7,8,9,10]);
		this.cyclist.animations.add('jump', [0,1,2,3,4,5,6,7,8,9,10]);
		this.cyclist.animations.add('stand', [16]);
		this.cyclist.animations.add('fire', [44,45,46,47,48,49,50,51,52,53,54,55,56]);
		this.game.physics.arcade.enable(this.cyclist);
		this.game.world.setBounds(0, 0, 800, 600);
		this.cyclist.body.collideWorldBounds = true;
		this.cyclist.checkWorldBounds = true;
		this.cyclist.body.gravity.y = this.gravitation;
		
		this.victory = this.game.add.tileSprite(0, 0, 800, 600, "victory");	
		this.victory.visible = false;

		this.sun = this.game.add.sprite(game.camera.width-180, 10, 'sun');
		this.sun.animations.add('sunShine');
		this.sun.animations.play('sunShine', 30, true);
		this.sun.anchor.set(1,0);
		
		this.horila = this.game.add.sprite(3400, game.world.height-90, "horila"); //3400
		this.horila.animations.add('horila');
		this.horila.animations.play('horila', 8, true);
		this.horila.anchor.set(1);
		this.game.physics.arcade.enable(this.horila);
		this.horila.body.gravity.y = this.gravitation;
		this.horila.autoCull = true;

		
		// other items in world 
		this.worldGroup();

		// Text
		this.bombNumber = this.game.add.sprite(this.game.world.width - 50, 10, 'bombCount');
		this.bombNumber.alpha = 0.4;
		this.bombText = this.game.add.text(game.world.width - 155, 25, 'Bomb ' + this.bombCount + ' x', { font: '24px Arial', fill: '#979895' });
		this.bananasNumber = this.game.add.sprite(160, 10, 'banana');
		this.bananasNumber.alpha = 0.4;
		this.bananasText= this.game.add.text(10, 25, 'Bananas ' + this.bananasCount + ' x', { font: '24px Arial', fill: '#979895' });
		this.gameText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '46px Arial', fill: '#000' });
		this.gameText.visible = false;
		this.gameText.anchor.set(0.5, 0.5);
	}

	update () {	
		this.bg.tilePosition.x -= this.speed;
		this.sun.position.x -= 0.2;
		this.floors.position.x -=this.speed;
		this.bananas.position.x -=this.speed;
		this.bomb.position.x -=this.speed;
		this.horila.position.x -=this.speed;
		this.bombFires();
		this.stopMove();

		this.game.physics.arcade.collide(this.cyclist, this.floors, this.cyclistOnFloor, null, this);
		this.game.physics.arcade.collide(this.horila, this.floors, this.horilaOnFloor, null, this);
		this.game.physics.arcade.collide(this.stones, this.floors);
		this.game.physics.arcade.collide(this.cyclist, this.stones, this.cyclistDead, null, this);
		this.game.physics.arcade.collide(this.bombFire, this.horila, this.horilaDead, null, this);
		this.game.physics.arcade.overlap(this.cyclist, this.bananas, this.cyclistGetBananas, null, this);
		this.game.physics.arcade.overlap(this.cyclist, this.bomb, this.cyclistGettBomb, null, this);
		this.game.physics.arcade.collide(this.cyclist, this.bat, this.cyclistDead, null, this);
		this.game.physics.arcade.collide(this.bombFire, this.floors);
		this.cyclist.events.onOutOfBounds.add(this.cyclistDead, this);
		this.batAttacks();
	}

	stopMove () {
		if(this.horila.inCamera && this.game.world.width-this.horila.x > 0){
			this.speed = 0;
			this.cyclist.animations.play('stand');	
			this.cyclist.events.onInputDown.add(this.bombFires, this);
			this.threwStone();
		}
	}

	cyclistDead (cyclist) {
		this.cyclist.angle -= 90;
		this.cyclist.position.x=150;
		this.cyclist.body.immovable = true;
		this.gameText.text=" GAME OVER \n Click to restart";
		this.gameText.visible = true;
		this.speed = 0;
		this.cyclist.animations.play('stand');	
		game.input.onDown.addOnce(function(){
			this.game.state.start('Game');
			this.gameText.visible = false;
		},this);
	}

	horilaDead (bombFire, horila) {
		this.horila.angle = 90;
		this.horila.position.x = this.game.world.width-150;
		this.horila.position.y = this.game.world.height;
		this.timeHorilaJump = 0;
		this.victory.visible = true;
		this.stones.destroy();
		this.bombFire.destroy();
		this.gameText.text=" You won \n Click to restart";
		this.gameText.visible = true;
		this.cyclist.animations.play('stand');	
		game.input.onDown.addOnce(function(){
			this.game.state.start('Game');
			this.gameText.visible = false;
		}, this);
	}

	horilaOnFloor () {
		if(this.horila.angle != 90){	
			this.timeHorilaJump = game.rnd.integerInRange(200, 350)
			this.horila.body.velocity.set(0, -this.timeHorilaJump);
		}
	}

	cyclistOnFloor (){
		if(this.cursors.up.isDown && this.cyclist.body.touching.down == true) {
			this.cyclist.body.velocity.y -= 300;
			this.cyclist.animations.play('jump', 50, true);
		}    
		else{
			this.cyclist.animations.play('ride', 20, true);
		}
	}

	batAttacks (){
		for (let i = 0; i < this.bat.length; i++) {
			let move = game.rnd.between(380, 300);
			this.bat.getChildAt(i).autoCull = true;
			this.bat.getChildAt(i).body.velocity.set(-350, 0);
			if (this.bat.getChildAt(i).inCamera){	
				this.bat.getChildAt(i).body.velocity.set(-350, -50);
				game.add.tween(this.bat.getChildAt(i)).to({ y: move }, 500, Phaser.Easing.Linear.None, true, 0);	
			}
		}
	}

	jump(){
			if(this.cursors.up.isDown && this.cyclist.body.touching.down == true) {
				this.cyclist.body.velocity.y -= 300;
				this.cyclist.animations.play('jump', 50, true);
			}    
			else{
				this.cyclist.animations.play('ride', 20, true);
			}
	}

	cyclistGetBananas(cyclist, banana){
		banana.kill();
		this.bananasCount++;
		this.bananasText.setText('Bananas ' + this.bananasCount + ' x');
	}

	cyclistGettBomb (cyclist, bomb) {
		bomb.kill();
		this.bombCount++;
		this.bombText.setText('Bomb ' + this.bombCount + ' x');
		
	}

	earth(){
		this.floors = game.add.group();
		this.floors.enableBody = true;
		this.phJson.floors.forEach(function (platforms){
			let sprite = this.floors.create(platforms.x, this.game.world.height, "floor")
			sprite.anchor.set(0,1);
			game.physics.enable(sprite, Phaser.Physics.ARCADE);
			sprite.body.immovable = true;
		}, this);
	}

	worldGroup(){
		this.bat = game.add.group();
		this.phJson.bat.forEach(function (item){
			let sprite = this.bat.create(item.x, item.y, "bat");
			let batSpeed = game.rnd.between(-250, -450);
			game.physics.enable(sprite);
			sprite.animations.add('batFlyes'); 
			sprite.animations.play('batFlyes', 5, true);
			sprite.body.immovable = true;
		},this);

		this.bananas = game.add.group();
		this.phJson.bananas.forEach(function (banana){
			let sprite = this.bananas.create(banana.x, banana.y, "banana");
			game.physics.enable(sprite);
		},this);

		this.bomb = game.add.group();
		this.phJson.bomb.forEach(function (bombas){
			let sprite = this.bomb.create(bombas.x, bombas.y, "bomb");
			game.physics.enable(sprite);
		},this);

		this.stones = game.add.group();
		this.stones.enableBody = true;
		this.stones.physicsBodyType = Phaser.Physics.ARCADE;
		this.stones.createMultiple(1, 'stone');
		this.stones.setAll('anchor.x', 0.5);
		this.stones.setAll('anchor.y', 1);
		this.stones.setAll('outOfBoundsKill', true);
		this.stones.setAll('checkWorldBounds', true);
	}

	bombFires (){
		if(this.bombCount > 0 && this.spaceKey.downDuration(1)){
			this.bombCount--;
			this.bombText.setText('Bomb ' + this.bombCount + ' x');	
			this.bombFire = game.add.group();
			this.bombFire.enableBody = true;
			game.physics.enable(this.bombFire, Phaser.Physics.ARCADE);
			this.bombFire.create(this.cyclist.body.x + 20, this.cyclist.body.y + 70, 'bombFire');

			let bombsFire = this.bombFire.getFirstExists(true);
			if(bombsFire){
				game.physics.enable(bombsFire, Phaser.Physics.ARCADE);
				bombsFire.body.gravity.y = this.gravitation;
				bombsFire.body.velocity.x =320;
				bombsFire.animations.add('bombFire');
				bombsFire.animations.play('bombFire',20, true);
			}
		}
	}

	threwStone () {
		let stone = this.stones.getFirstExists(false);
		if (stone){
			stone.reset(this.horila.body.x+60, this.horila.body.y+60);
			stone.animations.add('RollingStone');
			stone.animations.play('RollingStone', 40, true);
			stone.body.gravity.y = this.gravitation;
			stone.body.velocity.x = game.rnd.between(-150, -350);	
		}
	}
};