import RJS from '../../core/RJS';
import BaseButton from './BaseButton';
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
    };
    constructor(game: RJS, config: any);
    onClick(): void;
    setPushed(pushed: boolean): void;
}
