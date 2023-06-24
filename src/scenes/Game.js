import Phaser from "../lib/phaser.js";
let gameState = {
    windowWidth: 800
};

export default class Game extends Phaser.Scene {
    playerController;

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

        // The player is a collection of bodies and sensors
        this.playerController = {
            blocked: {
                left: false,
                right: false,
                bottom: false
            },
            lastJumpedAt: 0,
            speed: {
                run: 400,
                jump: 300
            }
        };
        //this.createParallaxBackgrounds();
        this.addPlayerToScene();
        this.createAnimations();
        this.playAnimations();

        gameState.player.setCollideWorldBounds(true);

    }

    update(time){
        this.handlePlayerMovement(time);
    }

    loadBackgroundImages(){
        this.load.image('backgroundLayer1', 'assets/bg_layer1.png');
    }
    loadPlatformImages(){
        this.load.image('platform', 'assets/ground_grass.png');
    }
    loadPlayerSprites(){
        this.load.unityAtlas('playerIdle', 'assets/atlas_unity/character_idle.png', 'assets/atlas_unity/character_idle.png.meta');
        this.load.unityAtlas('playerRun', 'assets/atlas_unity/character_run.png', 'assets/atlas_unity/character_run.png.meta');
        this.load.unityAtlas('playerJump', 'assets/atlas_unity/character_jump.png', 'assets/atlas_unity/character_jump.png.meta');
    }
    addPlayerToScene(){
        gameState.player = this.physics.add.sprite(125, 500, 'playerIdle'); // TODO GET ground coordinates
        gameState.player.setScale(0.5);
        gameState.player.flipX = true;
    }
    createAnimations(){
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('playerIdle', { prefix: 'idle_', start: 21, end: 41}),
            repeat: -1,
            frameRate: 20
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('playerRun', { prefix: 'run_', start: 10, end: 19}),
            repeat: -1,
            frameRate: 14
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('playerJump', { prefix: 'jump_', start: 19, end: 37}),
            repeat: 0,
            frameRate: 30,
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
    handlePlayerMovement(time){
        const canJump = (time - this.playerController.lastJumpedAt) > 250; // TODO Change: Can jump again when player touches the ground again
        if(gameState.cursors.up.isDown && gameState.cursors.right.isDown){
            gameState.player.flipX = true;
            gameState.player.setVelocityX(this.playerController.speed.run);
            gameState.player.setVelocityY(-this.playerController.speed.jump);
            gameState.player.anims.play('jump', true);
            this.playerController.lastJumpedAt = time;
        } else if(gameState.cursors.up.isDown && gameState.cursors.left.isDown){
            gameState.player.flipX = false;
            gameState.player.setVelocityX(-this.playerController.speed.run);
            gameState.player.setVelocityY(-this.playerController.speed.jump);
            gameState.player.anims.play('jump', true);
            this.playerController.lastJumpedAt = time;
        } else if (gameState.cursors.up.isDown) {
            // gameState.player.flipX = true;
            gameState.player.setVelocityY(-this.playerController.speed.jump);
            gameState.player.anims.play('jump', true);
        }  else if (gameState.cursors.right.isDown) {
            gameState.player.flipX = true;
            gameState.player.setVelocityX(this.playerController.speed.run);
            gameState.player.anims.play('run', true);
            this.playerController.lastJumpedAt = time;
        } else if(gameState.cursors.left.isDown){
            gameState.player.flipX = false;
            gameState.player.setVelocityX(-this.playerController.speed.run);
            gameState.player.anims.play('run', true);
        } else {
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('idle', true);
        }
    }
}