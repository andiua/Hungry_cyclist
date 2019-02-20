class Preload {
	constructor(game) { }
	preload(){ 
		this.preloader = this.add.sprite(this.game.world.centerX-300, this.game.world.centerY, 'preloader');
		this.preloader.anchor.setTo(0,1);
		this.load.setPreloadSprite(this.preloader);

		this.game.load.image("jungle", "assets/png-jungle-6.png");
		this.game.load.image("floor", "assets/floor.png");
		this.game.load.spritesheet('cyclist', 'assets/cyclist_sprite.png', 149, 149, 98);
		this.game.load.spritesheet('sun', 'assets/sun_sprite.png', 100, 75);
		this.game.load.image("banana", "assets/banana.png");
		this.game.load.image("bomb", "assets/bomb.png");
		this.game.load.spritesheet('bat', 'assets/bat.png', 50, 49);
		this.game.load.spritesheet('bombCount', 'assets/bombsprite.png', 54, 50);
		this.game.load.spritesheet('bombFire', 'assets/bomb_sprite.png', 60, 49);
		this.game.load.spritesheet('horila', 'assets/horila_sprite.png', 200, 200);
		this.game.load.spritesheet('stone', 'assets/stone_sprite.png', 65, 64);
		this.game.load.json('level:1', 'js/sprite.json');
		this.game.load.image("victory", 'assets/IMG_2497.jpg');
	}

	create(){
		this.game.state.start("Game");
	}
}