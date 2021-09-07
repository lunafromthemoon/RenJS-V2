import RJS from '../../core/RJS';
import { Sprite } from 'phaser-ce';
export default class MaskedSlider extends Sprite {
    currentValue: number;
    id: string;
    game: RJS;
    sliderFull: Sprite;
    config: {
        x: number;
        y: number;
        asset: string;
        binding: string;
        sfx: string;
    };
    constructor(game: RJS, config: any, currentValue: number);
    updateMask(): void;
}
