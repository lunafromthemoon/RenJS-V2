import RJS from '../../core/RJS';
import {Button} from 'phaser-ce';
import {getButtonFrames} from '../../utils/gui'

export default class PushButton extends Button {

    pushed: boolean;

    config: {
        x:number,
        y:number,
        asset:string,
        sfx:string,
        binding:string,
        slot:string,
        pushButton?:boolean,
        pushed?:boolean
    }

    constructor(game: RJS, config) {
        super(game, config.x, config.y,config.asset,()=>{
            this.setPushed(!this.pushed);
            if (config.sfx && config.sfx !== 'none') {
                game.managers.audio.playSFX(config.sfx);
            }
            game.gui.bindingActions[config.binding](config,this.pushed);
        },game);
        this.config = config;
        this.game = game;
        this.setPushed(config.pushed)
    }

    setPushed(pushed:boolean){
        this.pushed = pushed;
        this.setFrames(...getButtonFrames(this.animations.frameTotal/2,this.pushed));
    }
}
