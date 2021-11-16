import RJS from '../../core/RJS';
import {Button} from 'phaser-ce';

export default class BaseButton extends Button {

    game: RJS;

    config: {
        x: number;
        y: number;
        asset: string;
        sfx: string;
        binding: string;
        pushed?: boolean;
    }

    constructor(game: RJS, config) {
        super(game, config.x, config.y,config.asset,()=>{
            this.onClick();
        });
        this.setFrames(...BaseButton.getButtonFrames(this.animations.frameTotal))
        this.config = config;
        this.game = game;
    }

    static getButtonFrames(total: number, pushed = false): number[]{
      // button frames -> over|out|down|up
      const buttonFrames = {
          1: {normal: [0,0,0,0],pushed:[1,1,1,1]},
          2: {normal: [1,0,1,0],pushed:[3,2,3,2]},
          3: {normal: [1,0,2,0],pushed:[4,3,5,3]},
          4: {normal: [1,0,2,3],pushed:[5,4,6,7]},
      }
      return buttonFrames[total][pushed ? 'pushed' : 'normal']
    }

    onClick(): void{
    	if (this.config.sfx && this.config.sfx !== 'none') {
            this.game.managers.audio.playSFX(this.config.sfx);
        }
        this.game.gui.bindingActions[this.config.binding](this.config,this);
    }

}
