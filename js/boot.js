class Boot {
	constructor() { }
	init(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
	}

	preload(){
		this.load.image('preloader', 'assets/preloader.png');
	}
	
	create(){
		this.game.stage.backgroundColor = "#fff";
		this.game.state.start("Preload");
	}
}