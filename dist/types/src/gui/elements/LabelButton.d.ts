import RJS from '../../core/RJS';
import Label from './Label';
import BaseButton from './BaseButton';
export default class LabelButton extends BaseButton {
    game: RJS;
    label: Label;
    lastFrame: number | string;
    config: {
        x: number;
        y: number;
        asset: string;
        sfx: string;
        binding: string;
        pushed?: boolean;
        text?: any;
        label: {
            x: number;
            y: number;
            text?: string;
            lineSpacing: number;
            style: any;
            overStyle?: any;
            clickedStyle?: any;
        };
    };
    constructor(game: RJS, config: any);
}
