import RJS from '../../core/RJS';
import { Button } from 'phaser-ce';
export default class BaseButton extends Button {
    game: RJS;
    config: {
        x: number;
        y: number;
        asset: string;
        sfx: string;
        binding: string;
        pushed?: boolean;
    };
    constructor(game: RJS, config: any);
    static getButtonFrames(total: number, pushed?: boolean): number[];
    onClick(): void;
}
