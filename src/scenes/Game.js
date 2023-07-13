import Phaser from "../lib/phaser.js";
import config from "../config.js";

let gameState = {
    windowWidth: null
};

export default class Game extends Phaser.Scene {
    playerController;
    gameController;

    constructor() {
        super('game');
    }

    preload() {
        this.initControllers();
        this.loadBackgroundImages();
        this.loadPlatformImages();
        this.loadPlayerSprites();

        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.addParallaxBackgrounds();
        this.addPlayerToScene();
        this.addAnimations();
        this.setPlayerFollowCamera();
        this.addPlatformsToScene();
        this.handlePlayerTouchesBottomWindow();
        this.playAnimations();
    }

    update() {
        this.rotateImage(gameState.backgroundLayer1Planet, 0.001);
        this.handlePlayerOnPlatform();
        this.handlePlayerMovement();
    }

    handlePlayerOnPlatform() {
        if (gameState.player.isOnPlatform && gameState.player.currentPlatform) {
            gameState.player.body.position.x += gameState.player.currentPlatform.vx;
            gameState.player.body.position.y += (gameState.player.currentPlatform.vy);
            gameState.player.isOnPlatform = false;
            gameState.player.currentPlatform = null;
        }
    }

    rotateImage(image, speed) {
        image.rotation += speed;
    }

    loadBackgroundImages() {
        // this.load.image('backgroundLayer1Planet', 'assets/background/mountain.png');
        this.load.image('backgroundLayer1Planet', 'assets/background/planet.png');
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
        this.load.unityAtlas('playerVanish', 'assets/atlas_unity/character_vanish.png', 'assets/atlas_unity/character_vanish.png.meta');
    }

    addPlayerToScene() {
        gameState.player = this.physics.add.sprite(125, 100, 'playerIdle');
        gameState.player.setScale(0.4);
        gameState.player.setBodySize(150, 180);
        gameState.player.body.offset.y = 90;
        gameState.player.flipX = true;
        gameState.player.setCollideWorldBounds(true);

        if (config.physics.arcade.debug) {
            gameState.playerText = this.add.text(gameState.player.body.position.x, gameState.player.body.position.y, `x: ${gameState.player.body.position.x} | y: ${gameState.player.body.position.y}\ngameState.player.width: ${gameState.player.body.width} | gameState.player.height: ${gameState.player.body.height}`).setTint(0x000000);
        }
    }

    handlePlayerTouchesBottomWindow() {
        // Detect when the character touches the bottom of the window
        gameState.player.body.onWorldBounds = true;


        // World bounds collision callback function
        let onWorldBoundsCollision = (body) => {
            if (body.gameObject === gameState.player && body.blocked.down) {
                this.gameController.gameOver = true;
                gameState.player.anims.play('vanish', true);
            }
        }

        this.physics.world.on('worldbounds', onWorldBoundsCollision, this);
    }

    addPlatformsToScene() {
        gameState.platforms = this.physics.add.staticGroup();
        // console.log(`gameState.player.body.height: ${gameState.player.body.height}`);
        // console.log(`config.height: ${config.height}`);

        // const minY = (gameState.player.height * 2);
        // const maxY = (config.height - (gameState.player.body.height * 2));
        // for (let i = 0; i < 5; i++) {
        //     let x = Phaser.Math.Between(100, gameState.windowWidth);
        //     const y = 100 * i;
        //     // const y = Phaser.Math.Between(0, config.height - gameState.player.body.height);
        //     const platform = gameState.platforms.create(x, y, 'platform').setOrigin(0, 0);
        //
        //     if (config.physics.arcade.debug) {
        //         this.add.text(x, y, `x: ${x} | y: ${y}\nplatform.width: ${platform.body.width} | platform.height: ${platform.body.height}`).setTint(0x000000);
        //         platform.body.updateFromGameObject();
        //     }
        // }

        const x = 200;
        const platform = gameState.platforms.create(x, 200, 'platform');
        platform.setOrigin(0, 0);

        const distance = 250; // Total distance to move
        const duration = 10000; // Duration of the movement (in milliseconds)

        if (config.physics.arcade.debug) {
            // gameState.platformText = this.add.text(platform.body.position.x, platform.body.position.y, `x: ${platform.body.position.x} | y: ${platform.body.position.y}\nplatform.width: ${platform.body.width} | platform.height: ${platform.body.height}`).setTint(0x000000);
        }


        this.tweens.add({
            targets: platform.body,
            y: platform.body.y + distance,
            duration: duration / 2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                platform.vx = platform.body.position.x - platform.previousX;
                platform.vy = platform.body.position.y - platform.previousY;
                platform.previousX = platform.body.position.x;
                platform.previousY = platform.body.position.y;

                platform.y = platform.body.position.y;
                platform.x = platform.body.position.x;


                if (config.physics.arcade.debug) {
                    // gameState.platformText.x = (platform.body.position.x + 150);
                    // gameState.platformText.y = platform.body.position.y;
                    // gameState.platformText.text = `x: ${platform.body.position.x} | y: ${platform.body.position.y}\nplatform.width: ${platform.body.width} | platform.height: ${platform.body.height}`;
                }
            },
        });

        const collisionMovingPlatform = (sprite, platform) => {
            if (platform.body.touching.up && sprite.body.touching.down) {
                sprite.isOnPlatform = true;
                sprite.currentPlatform = platform;
            }
        };

        const isCollisionFromTop = (sprite, platform) => {
            // Only allow collisions from top
            return platform.body.y > sprite.body.y;
        };
        this.physics.add.collider(
            gameState.player,
            platform,
            collisionMovingPlatform,
            isCollisionFromTop,
            this
        );

        //this.physics.add.collider(gameState.player, gameState.platforms);

    }

    addAnimations() {
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
        this.anims.create({
            key: 'vanish',
            frames: this.anims.generateFrameNames('playerVanish', {prefix: 'vanish_', start: 0, end: 32}),
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

    addParallaxBackgrounds() {

        gameState.backgroundLayer1Planet = this.add.image(300, 300, 'backgroundLayer1Planet'); // backgroundLayer1Planet = width /2 = 300
        gameState.backgroundLayer2 = this.add.image(0, 0, 'backgroundLayer2');
        gameState.backgroundLayer3 = this.add.image(0, 0, 'backgroundLayer3');

        // gameState.backgroundLayer1Planet.setOrigin(0, 0);
        gameState.backgroundLayer2.setOrigin(0, 0);
        gameState.backgroundLayer3.setOrigin(0, 0);

        // Get larger background width
        gameState.windowWidth = parseFloat(gameState.backgroundLayer3.getBounds().width);

        const backgroundLayer1PlanetWidth = gameState.backgroundLayer1Planet.getBounds().width;
        const backgroundLayer2Width = gameState.backgroundLayer2.getBounds().width;

        gameState.backgroundLayer1Planet.setScrollFactor((backgroundLayer1PlanetWidth - config.width) / (gameState.windowWidth - config.width));
        gameState.backgroundLayer2.setScrollFactor((backgroundLayer2Width - config.width) / (gameState.windowWidth - config.width));

    }

    playAnimations() {
        gameState.player.anims.play('idle', true);
    }

    setPlayerFollowCamera() {
        this.cameras.main.setBounds(0, 0, gameState.backgroundLayer3.width, gameState.backgroundLayer3.height);
        this.physics.world.setBounds(0, 0, gameState.backgroundLayer3.width, gameState.backgroundLayer3.height);
        this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)
    }

    handlePlayerMovement() {

        if (this.gameController.gameOver) {
            return;
        }

        if (gameState.cursors.right.isDown && gameState.cursors.down.isDown) {
            gameState.player.flipX = true;
            if (gameState.player.body.blocked.down) {
                gameState.player.setVelocityX(this.playerController.speed.run / 2);
                gameState.player.anims.play('crawl', true);
                // gameState.player.setBodySize(150, 130);
                // gameState.player.body.offset.y = 140;
            }
        } else if (gameState.cursors.left.isDown && gameState.cursors.down.isDown) {

            gameState.player.flipX = false;
            if (gameState.player.body.blocked.down) {
                gameState.player.body.blocked.down && gameState.player.setVelocityX(-this.playerController.speed.run / 2);
                gameState.player.anims.play('crawl', true);
                // gameState.player.setBodySize(150, 130);
                // gameState.player.body.offset.y = 140;
            }
        } else if (gameState.cursors.right.isDown) {
            gameState.player.flipX = true;
            const runSpeed = gameState.player.body.blocked.down ? this.playerController.speed.run : this.playerController.speed.run / 1.5 // Slow down when jumping
            gameState.player.setVelocityX(runSpeed);
            gameState.player.anims.play('run', true);
        } else if (gameState.cursors.left.isDown) {
            gameState.player.flipX = false;
            const runSpeed = gameState.player.body.blocked.down ?
                this.playerController.speed.run : this.playerController.speed.run / 1.5 // Slow down when jumping
            gameState.player.setVelocityX(-runSpeed);
            gameState.player.anims.play('run', true);
        } else if (gameState.cursors.down.isDown) {
            // gameState.player.setBodySize(150, 130); // Move to function
            // gameState.player.body.offset.y = 140; // Move to function
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('duck', true);
        } else {
            // gameState.player.setBodySize(150, 180); // Move to function
            // gameState.player.body.offset.y = 90; // Move to function
            gameState.player.anims.play('idle', true);
            gameState.player.setVelocityX(0);

        }
        //
        if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.blocked.down) {
            gameState.player.setVelocityY(-500);
        }
        //
        // if (!gameState.player.body.blocked.down) {
        //     gameState.player.anims.play('jump', true);
        // }
        //
        if (config.physics.arcade.debug) {
            gameState.playerText.x = (gameState.player.body.position.x + 150);
            gameState.playerText.y = gameState.player.body.position.y;
            gameState.playerText.text = `x: ${gameState.player.body.position.x} | y: ${gameState.player.body.position.y}\ngameState.player.width: ${gameState.player.body.width} | gameState.player.height: ${gameState.player.body.height}`;
        }

    }

    initControllers() {
        this.playerController = {
            speed: {
                run: 450,
                jump: 300
            }
        };
        this.gameController = {
            gameOver: false
        };
    }
}