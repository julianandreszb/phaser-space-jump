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

        this.createParallaxBackgrounds();
        this.addPlayerToScene();
        // this.addPlatformsToScene();
        this.createAnimations();
        this.playAnimations();

        this.cameras.main.setBounds(0, 0, gameState.backgroundLayer3.width, gameState.backgroundLayer3.height);
        this.physics.world.setBounds(0, 0, gameState.backgroundLayer3.width, gameState.backgroundLayer3.height);
        this.cameras.main.startFollow(gameState.playerBody, true, 0.5, 0.5)

        //gameState.player.setCollideWorldBounds(true);
        // gameState.player.getAll().forEach(child => child.setCollideWorldBounds(true));
        this.physics.add.collider(gameState.player, gameState.platforms);
        this.physics.add.overlap(gameState.player, gameState.platforms);
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
        this.load.unityAtlas('playerGun', 'assets/atlas_unity/character_gun.png', 'assets/atlas_unity/character_gun.png.meta');
        this.load.unityAtlas('weaponRifle', 'assets/atlas_unity/weapon_rifle.png', 'assets/atlas_unity/weapon_rifle.png.meta');
        this.load.unityAtlas('weaponGun', 'assets/atlas_unity/weapon_gun.png', 'assets/atlas_unity/weapon_gun.png.meta');
    }

    addPlayerToScene() {

        // gameState.player = this.physics.add.sprite(125, 400, 'playerIdle');
        // gameState.player.setScale(0.4);
        // gameState.player.setBodySize(150, 180);
        // gameState.player.flipX = true;

        gameState.playerBody = this.physics.add.sprite(0, 0, 'playerGun', 'gun_0')
            .setBodySize(150, 180);
            // .setBodySize(200, 180);
        gameState.playerBody.body.offset.y = 85;
        gameState.playerBody.flipX = true;
        gameState.playerBody.setCollideWorldBounds(true);

        gameState.playerWeaponRifle = this.physics.add.sprite(20, 110, 'weaponRifle', 'rifle_0')
            .setBodySize(169, 110)
            // .setBodySize(200, 110)
            .setVisible(true)
            .setDepth(1)
            .setImmovable(false);
        gameState.playerWeaponRifle.setCollideWorldBounds(true);

        gameState.playerWeaponRifle.setOrigin(0.5, 0);
        gameState.playerWeaponRifle.body.offset.y = 190;
        gameState.playerWeaponRifle.body.offset.x = 175;
        // gameState.playerWeaponRifle.body.allowGravity = false;
        gameState.playerWeaponRifle.flipX = true;

        gameState.playerWeaponGun = this.physics.add.sprite(20, 110, 'weaponGun', 'gun_0')
            .setBodySize(169, 110)
            // .setBodySize(200, 110)
            .setVisible(true)
            .setDepth(1)
            .setImmovable(false);
        gameState.playerWeaponGun.setCollideWorldBounds(true);

        gameState.playerHand = this.physics.add.sprite(0, 90, 'playerGun', 'gun_1')
            .setBodySize(80, 100)
            // .setBodySize(200, 100)
            .setVisible(true)
            .setDepth(2)
            .setImmovable(true);
        gameState.playerHand.body.offset.y = 160;
        // gameState.playerHand.body.allowGravity = false;
        gameState.playerHand.flipX = true;
        gameState.playerHand.setCollideWorldBounds(true);

        gameState.player = this.add.container(125, 500, [
            gameState.playerBody,
            gameState.playerWeaponRifle,
            gameState.playerHand
        ]);

        // setTimeout(()=> {
        //     gameState.playerBody.anims.play('idle', true);
        //     gameState.playerWeaponRifle.setVisible(false);
        //     gameState.playerHand.setVisible(false);
        // }, 5000);
        //
        // setTimeout(()=> {
        //     gameState.playerBody.anims.play('gun', true);
        //     gameState.playerWeaponRifle.setVisible(true);
        //     gameState.playerHand.setVisible(true);
        // }, 10000);


        // Example 2
        // gameState.player = this.physics.add.sprite(125, 400, 'playerGun', 'gun_0');
        // gameState.player.setScale(0.4);
        // gameState.player.setBodySize(150, 180);
        // gameState.player.flipX = true;
        //
        // gameState.playerHand = this.physics.add.sprite(125, 400, 'playerGun', 'gun_1');
        // gameState.playerHand.setScale(0.4);
        // gameState.playerHand.setBodySize(150, 180);
        // gameState.playerHand.flipX = true;
        //
        // this.physics.add.existing(gameState.player, false);
        // this.physics.add.existing(gameState.playerHand, false);

        // Example 1
        // const playerBody = this.add.sprite(100, 400, 'playerGun', 'gun_0').setScale(0.4);
        // const playerHand = this.add.sprite(100, 400, 'playerGun', 'gun_1').setScale(0.4);
        // const constraint1 = Phaser.Physics.Matter.Matter.Constraint.create({
        //     bodyA: playerBody.body,
        //     bodyB: playerHand.body,
        //     pointA: { x: 0, y: 0 },
        //     pointB: { x: 0, y: 0 },
        // });

        if (config.physics.arcade.debug) {
            gameState.playerPositionText = this.add.text(gameState.player.x, gameState.player.y, `x: ${gameState.player.x} - y: ${gameState.player.y}`);
            gameState.playerPositionText.setTint(0x00000);
        }
    }

    addPlatformsToScene(){
        gameState.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, 800);
            const y = 150 * i;
            const platform = gameState.platforms.create(x, y, 'platform').setOrigin(0, 0);

            if (config.physics.arcade.debug) {
                this.add.text(x, y, `x: ${x} | y: ${y}\nplatform.width: ${platform.body.width} | platform.height: ${platform.body.height}`).setTint(0x000000);
                platform.body.updateFromGameObject();
            }
        }
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
        this.anims.create({
            key: 'gun',
            frames: this.anims.generateFrameNames('playerGun', {prefix: 'gun_', start: 0, end: 0}),
            repeat: -1,
            frameRate: 30
        });
        this.anims.create({
            key: 'gunHand',
            frames: this.anims.generateFrameNames('playerGun', {prefix: 'gun_', start: 1, end: 1}),
            repeat: -1,
            frameRate: 30
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
        //gameState.player.anims.play('idle', true);
        //gameState.player.list[0].play('idle');
    }

    handlePlayerMovement() {

        if (gameState.cursors.right.isDown) {
            gameState.playerWeaponRifle.setOrigin(0.5, 0);
            gameState.playerWeaponRifle.body.offset.x = 175;

            gameState.playerBody.flipX = true;
            gameState.playerWeaponRifle.flipX = true;
            gameState.playerHand.flipX = true;

            //gameState.playerBody.anims.play('gun', true);
            gameState.playerBody.anims.play('run', true);
            gameState.playerBody.setVelocityX(this.playerController.speed.run);
            gameState.playerWeaponRifle.setVelocityX(this.playerController.speed.run).setVisible(true);
            gameState.playerHand.setVelocityX(this.playerController.speed.run).setVisible(true);

            // gameState.playerWeaponRifle.setVisible(false);
            // gameState.playerHand.setVisible(false);
            //gameState.playerBody.anims.play('run', true);
        } else if (gameState.cursors.left.isDown) {

            console.log(gameState.playerWeaponRifle.body.blocked);


            gameState.playerWeaponRifle.body.offset.x = 80;
            gameState.playerWeaponRifle.setOrigin(0.6, 0);

            gameState.playerBody.flipX = false;
            gameState.playerWeaponRifle.flipX = false;
            gameState.playerHand.flipX = false;



            gameState.playerBody.anims.play('gun', true);

            if (gameState.playerWeaponRifle.body.blocked.left) {

            } else {
                gameState.playerBody.setVelocityX(-this.playerController.speed.run);
                gameState.playerWeaponRifle.setVelocityX(-this.playerController.speed.run).setVisible(true);
                gameState.playerHand.setVelocityX(-this.playerController.speed.run).setVisible(true);
            }



            // gameState.playerWeaponRifle.setVisible(false);
            // gameState.playerHand.setVisible(false);
            //gameState.playerBody.anims.play('run', true);
        } else {
            gameState.playerBody.anims.play('idle', true);
            gameState.playerBody.setVelocityX(0)
            gameState.playerWeaponRifle.setVelocityX(0)
                .setVisible(false);
            gameState.playerHand.setVelocityX(0)
                .setVisible(false);
        }

//         if (gameState.cursors.right.isDown && gameState.cursors.down.isDown) {
//             gameState.player.flipX = true;
//             gameState.player.setVelocityX(this.playerController.speed.run / 2);
//             gameState.player.anims.play('crawl', true);
//         } else if (gameState.cursors.left.isDown && gameState.cursors.down.isDown) {
//             gameState.player.flipX = false;
//             gameState.player.setVelocityX(-this.playerController.speed.run / 2);
//             gameState.player.anims.play('crawl', true);
//         } else if (gameState.cursors.right.isDown) {
//             gameState.player.flipX = true;
//             const runSpeed = gameState.player.body.blocked.down ? this.playerController.speed.run : this.playerController.speed.run / 1.5 // Slow down when jumping
//             gameState.player.setVelocityX(runSpeed);
//             gameState.player.anims.play('run', true);
//         } else if (gameState.cursors.left.isDown) {
//             gameState.player.flipX = false;
//             const runSpeed = gameState.player.body.blocked.down ?
//                 this.playerController.speed.run : this.playerController.speed.run / 1.5 // Slow down when jumping
//             gameState.player.setVelocityX(-runSpeed);
//             gameState.player.anims.play('run', true);
//         } else if (gameState.cursors.down.isDown) {
//             gameState.player.setBodySize(150, 130); // Move to function
//             gameState.player.body.offset.y = 135; // Move to function
//             gameState.player.setVelocityX(0);
//             gameState.player.anims.play('duck', true);
//         } else {
//             gameState.player.setBodySize(150, 180); // Move to function
//             gameState.player.body.offset.y = 85; // Move to function
//             gameState.player.setVelocityX(0);
//             gameState.player.anims.play('idle', true);
//         }
//
        if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.playerBody.body.blocked.down) {
            gameState.playerBody.setVelocityY(-500);
            gameState.playerWeaponRifle.setVelocityY(-500);
            gameState.playerHand.setVelocityY(-500);
        }
//
//         if (!gameState.player.body.blocked.down) {
//             gameState.player.anims.play('jump', true);
//         }
//
//         if (config.physics.arcade.debug) {
//             //offset.y = ${gameState.player.body.offset.y} | offset.x = ${gameState.player.body.offset.x}
//
//             gameState.playerPositionText.x = gameState.player.x - 160;
//             gameState.playerPositionText.y = gameState.player.y - 100;
//             gameState.playerPositionText.text =
//                 `x: ${gameState.player.x} | y: ${gameState.player.y}
// body.width ${gameState.player.body.width} | body.height ${gameState.player.body.height}
// body.blocked:
// - up: ${gameState.player.body.blocked.up}
// - right: ${gameState.player.body.blocked.right}
// - left: ${gameState.player.body.blocked.left}
// - down: ${gameState.player.body.blocked.down}
// Overlap:
// - overlapY: ${gameState.player.body.overlapY}
// `;
//         }

    }
}