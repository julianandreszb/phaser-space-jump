import Phaser from "./lib/phaser.js";
import Game from "./scenes/Game.js";

export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            enableBody: true,
            debug: true
        }
    },
    scene: [Game]
}