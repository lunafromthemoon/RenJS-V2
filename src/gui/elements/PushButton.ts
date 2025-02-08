import RJS from '@/core/RJS';
import BaseButton from '@/elements/BaseButton';

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

    onClick(): void{
        this.setPushed(!this.pushed);
        super.onClick();
    }

    setPushed(pushed: boolean): void{
        this.pushed = pushed;
        this.setFrames(...BaseButton.getButtonFrames(this.animations.frameTotal/2,this.pushed));
    }
}
