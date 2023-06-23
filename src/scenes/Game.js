import Phaser from "../lib/phaser.js";
let gameState = {
    windowWidth: 800,
    speed: 300
};

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {
        this.loadBackgroundImages();
        this.loadPlatformImages();
        this.loadPlayerSprites();

        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        //this.add.image(0, 0, 'background').setOrigin(0, 0);
        // const platforms = this.physics.add.staticGroup();
        // for (let i = 0; i < 5; i++) {
        //     const x = Phaser.Math.Between(100, 800);
        //     const y = 150 * i;
        //     const platform = platforms.create(x, y, 'platform');
        //     platform.body.updateFromGameObject();
        // }
        //this.cameras.main.setBounds(0, 0, );

        this.createParallaxBackgrounds();
        this.addPlayerToScene();
        this.createAnimations();
        this.playAnimations();

        gameState.player.setCollideWorldBounds(true);

    }

    update(){
        this.handlePlayerMovement();
    }

    loadBackgroundImages(){
        this.load.image('backgroundLayer1', 'assets/bg_layer1.png');
    }
    loadPlatformImages(){
        this.load.image('platform', 'assets/ground_grass.png');
    }
    loadPlayerSprites(){
        this.load.spritesheet('playerIdle', 'assets/playerIdle.png', {frameWidth: 138, frameHeight: 173});
    }
    addPlayerToScene(){
        gameState.player = this.physics.add.sprite(125, 550, 'playerIdle'); // TODO GET ground coordinates
        gameState.player.setScale(0.5);
        gameState.player.flipX = true;
    }
    createAnimations(){
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 20 }),
            frameRate: 25,
            repeat: -1
        });
    }
    createParallaxBackgrounds(){

        gameState.backgroundLayer1 = this.add.image(0, 0, 'backgroundLayer1');

        gameState.backgroundLayer1.setOrigin(0, 0);

        const backgroundLayer1Width = gameState.backgroundLayer1.getBounds().width;

        gameState.width = parseFloat(gameState.backgroundLayer1.getBounds().width);

        gameState.backgroundLayer1.setScrollFactor((backgroundLayer1Width - gameState.windowWidth) / (gameState.width - gameState.windowWidth));

    }
    playAnimations() {
        gameState.player.anims.play('idle', true);
    }
    handlePlayerMovement(){
        if (gameState.cursors.right.isDown) {
            gameState.player.flipX = true;
            gameState.player.setVelocityX(gameState.speed);
            gameState.player.anims.play('run', true);
        } else if(gameState.cursors.left.isDown){
            gameState.player.flipX = false;
            gameState.player.setVelocityX(-gameState.speed);
            gameState.player.anims.play('run', true);
        } else {
            gameState.player.setVelocityX(0);
        }
    }
}