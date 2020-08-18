import 'pixi'
import 'p2'
import Phaser from "phaser-ce";
import {GameConfig} from "./IGameConfig";

class Game {
    public config: GameConfig
    public phaserGameInstance: Phaser.Game
    constructor(config: GameConfig) {
        this.config = config
        this.phaserGameInstance = new Phaser.Game(config);
    }
}

export default Game
