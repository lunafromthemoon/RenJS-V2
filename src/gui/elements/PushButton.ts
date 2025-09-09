import RJS from '../../core/RJS';
import { BaseButton } from './BaseButton';

export type PushButtonConfig = {
    x: number;
    y: number;
    asset: string;
    sfx: string;
    binding: string;
    slot: string;
    pushButton?: boolean;
    pushed?: boolean;
}
export class PushButton extends BaseButton {

    pushed: boolean;

    config: PushButtonConfig;

    constructor(game: RJS, config: PushButtonConfig) {
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
export default PushButton