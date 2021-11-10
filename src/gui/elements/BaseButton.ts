import RJS from '../../core/RJS';
import {Button} from 'phaser-ce';
import {getButtonFrames} from '../../utils/gui'

export default class BaseButton extends Button {

    game: RJS;

    config: {
        x: number,
        y: number,
        asset: string,
        sfx: string,
        binding: string,
        pushed?: boolean
    }

    constructor(game: RJS, config) {
        super(game, config.x, config.y,config.asset,()=>{
            this.onClick();
        });
        this.setFrames(...getButtonFrames(this.animations.frameTotal))
        this.config = config;
        this.game = game;
    }

    onClick(){
    	if (this.config.sfx && this.config.sfx !== 'none') {
            this.game.managers.audio.playSFX(this.config.sfx);
        }
        this.game.gui.bindingActions[this.config.binding](this.config,this);
    }

}
