import 'pixi'
import 'p2'
import Phaser from "phaser-ce";
import {RJSGameConfig} from "./RJSGameConfig";
import RJS from "./RJS";

class RJSGame extends Phaser.Game {
    config: RJSGameConfig
    RJS: RJS
    constructor(config: RJSGameConfig) {
        super()
        this.config = config
        this.RJS = new RJS(this)
    }
}

export default RJSGame
