import RJS from '../../core/RJS';
import { Sprite } from 'phaser-ce';
export default class MaskedSlider extends Sprite {
    readonly min: number;
    readonly max: number;
    id: string;
    game: RJS;
    sliderFull: Sprite;
    currentValue: number;
    range: number;
    config: {
        x: number;
        y: number;
        asset: string;
        binding: string;
        sfx: string;
    };
    constructor(game: RJS, config: any, min: number, max: number, startValue: number);
    updateMask(): void;
}
