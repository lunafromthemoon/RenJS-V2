import 'pixi'
import 'p2'
import Phaser from 'phaser-ce';
import {RJSGameConfig} from './RJSGameConfig';
import RJS from './RJS';
import {defaults} from './Defaults';

class RJSGame extends Phaser.Game {
    config: RJSGameConfig
    RJS: RJS
    defaultValues = {...defaults}

    constructor(config: RJSGameConfig) {
        super()
        this.config = config
        this.RJS = new RJS(this)
    }
}

export default RJSGame
