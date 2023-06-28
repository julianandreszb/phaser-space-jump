import Phaser from "./lib/phaser.js";
import Game from "./scenes/Game.js";

export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500
            },
            enableBody: true,
            debug: true
        }
    },
    scene: [Game]
}