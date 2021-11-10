import RJS from '../../core/RJS';
import BaseButton from './BaseButton';
import {getButtonFrames} from '../../utils/gui'

export default class PushButton extends BaseButton {

    pushed: boolean;

    config: {
        x: number;
        y: number;
        asset: string;
        sfx: string;
        binding: string;
        slot: string;
        pushButton?: boolean;
        pushed?: boolean;
    }

    constructor(game: RJS, config) {
        super(game, config);
        this.setPushed(config.pushed)
    }

    onClick(){
        this.setPushed(!this.pushed);
        super.onClick();
    }

    setPushed(pushed: boolean){
        this.pushed = pushed;
        this.setFrames(...getButtonFrames(this.animations.frameTotal/2,this.pushed));
    }
}
