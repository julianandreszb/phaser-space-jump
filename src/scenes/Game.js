import Phaser from "../lib/phaser.js";
import config from "../config.js";

let gameState = {
    windowWidth: null
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

        this.playerController = {
            speed: {
                run: 450,
                jump: 300
            }
        };

        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        //this.add.image(0, 0, 'background').setOrigin(0, 0);
        gameState.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, 800);
            const y = 150 * i;
            const platform = gameState.platforms.create(x, y, 'platform');
            platform.body.updateFromGameObject();
        }


        // The player is a collection of bodies and sensors

        this.createParallaxBackgrounds();
        this.addPlayerToScene();
        this.createAnimations();
        this.playAnimations();

        this.cameras.main.setBounds(0, 0, gameState.backgroundLayer3.width, gameState.backgroundLayer3.height);
        this.physics.world.setBounds(0, 0, gameState.backgroundLayer3.width, gameState.backgroundLayer3.height);
        this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)

        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, gameState.platforms);
    }

    update(time) {
        this.handlePlayerMovement(time);
    }

    loadBackgroundImages() {
        this.load.image('backgroundLayer1', 'assets/background/mountain.png');
        this.load.image('backgroundLayer2', 'assets/background/trees.png');
        this.load.image('backgroundLayer3', 'assets/background/snowDunes.png');
    }

    loadPlatformImages() {
        this.load.image('platform', 'assets/ground_grass.png');
    }

    loadPlayerSprites() {
        this.load.unityAtlas('playerIdle', 'assets/atlas_unity/character_idle.png', 'assets/atlas_unity/character_idle.png.meta');
        this.load.unityAtlas('playerRun', 'assets/atlas_unity/character_run.png', 'assets/atlas_unity/character_run.png.meta');
        this.load.unityAtlas('playerJump', 'assets/atlas_unity/character_jump.png', 'assets/atlas_unity/character_jump.png.meta');
        this.load.unityAtlas('playerDuck', 'assets/atlas_unity/character_duck.png', 'assets/atlas_unity/character_duck.png.meta');
        this.load.unityAtlas('playerCrawl', 'assets/atlas_unity/character_crawl.png', 'assets/atlas_unity/character_crawl.png.meta');
    }

    addPlayerToScene() {
        gameState.player = this.physics.add.sprite(125, 400, 'playerIdle');
        gameState.player.setScale(0.4);
        gameState.player.setBodySize(150, 180);
        gameState.player.body.offset.y = 90;
        gameState.player.flipX = true;
    }

    createAnimations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('playerIdle', {prefix: 'idle_', start: 21, end: 41}),
            repeat: -1,
            frameRate: 20
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('playerRun', {prefix: 'run_', start: 10, end: 19}),
            repeat: -1,
            frameRate: 20
        });
        this.anims.create({
            key: 'duck',
            frames: this.anims.generateFrameNames('playerDuck', {prefix: 'duck_', start: 22, end: 41}),
            repeat: -1,
            frameRate: 20
        });
        this.anims.create({
            key: 'crawl',
            frames: this.anims.generateFrameNames('playerCrawl', {prefix: 'crawl_', start: 20, end: 37}),
            repeat: -1,
            frameRate: 20
        });
        // Commented - Full jump animation
        // this.anims.create({
        //     key: 'jump',
        //     frames: this.anims.generateFrameNames('playerJump', { prefix: 'jump_', start: 19, end: 37}),
        //     repeat: 0,
        //     frameRate: 30,
        // });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('playerJump', {prefix: 'jump_', start: 28, end: 28}),
            repeat: 0,
            frameRate: 20
        });
    }

    createParallaxBackgrounds() {

        gameState.backgroundLayer1 = this.add.image(0, 0, 'backgroundLayer1');
        gameState.backgroundLayer2 = this.add.image(0, 0, 'backgroundLayer2');
        gameState.backgroundLayer3 = this.add.image(0, 0, 'backgroundLayer3');

        gameState.backgroundLayer1.setOrigin(0, 0);
        gameState.backgroundLayer2.setOrigin(0, 0);
        gameState.backgroundLayer3.setOrigin(0, 0);

        // Get larger background width
        gameState.windowWidth = parseFloat(gameState.backgroundLayer3.getBounds().width);

        const backgroundLayer1Width = gameState.backgroundLayer1.getBounds().width;
        const backgroundLayer2Width = gameState.backgroundLayer2.getBounds().width;

        gameState.backgroundLayer1.setScrollFactor((backgroundLayer1Width - config.width) / (gameState.windowWidth - config.width));
        gameState.backgroundLayer2.setScrollFactor((backgroundLayer2Width - config.width) / (gameState.windowWidth - config.width));

    }

    playAnimations() {
        gameState.player.anims.play('idle', true);
    }

    handlePlayerMovement() {
        if (gameState.cursors.right.isDown && gameState.cursors.down.isDown) {
            gameState.player.flipX = true;
            gameState.player.setVelocityX(this.playerController.speed.run / 2);
            gameState.player.anims.play('crawl', true);
        } else if (gameState.cursors.left.isDown && gameState.cursors.down.isDown) {
            gameState.player.flipX = false;
            gameState.player.setVelocityX(-this.playerController.speed.run / 2);
            gameState.player.anims.play('crawl', true);
        } else if (gameState.cursors.right.isDown) {
            gameState.player.flipX = true;
            const runSpeed = gameState.player.body.blocked.down ?
                this.playerController.speed.run : this.playerController.speed.run / 1.5 // Slow down when jumping
            gameState.player.setVelocityX(runSpeed);
            gameState.player.anims.play('run', true);
        } else if (gameState.cursors.left.isDown) {
            gameState.player.flipX = false;
            const runSpeed = gameState.player.body.blocked.down ?
                this.playerController.speed.run : this.playerController.speed.run / 1.5 // Slow down when jumping
            gameState.player.setVelocityX(-runSpeed);
            gameState.player.anims.play('run', true);
        } else if (gameState.cursors.down.isDown) {
            gameState.player.setBodySize(150, 130); // Move to function
            gameState.player.body.offset.y = 140; // Move to function
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('duck', true);
        } else {
            gameState.player.setBodySize(150, 180); // Move to function
            gameState.player.body.offset.y = 90; // Move to function
            gameState.player.anims.play('idle', true);
            gameState.player.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.blocked.down) {
            gameState.player.setVelocityY(-500);
        }

        if (!gameState.player.body.blocked.down) {
            gameState.player.anims.play('jump', true);
        }
    }
}