import RJS from '../../core/RJS';
import { Sprite, Text, Sound } from 'phaser-ce';
export default class MessageBox extends Sprite {
    id: string;
    text: Text;
    ctc?: Sprite;
    textSpeed: number;
    textLoop: number;
    punctuationMarks: string[];
    punctuationWait: number;
    defaultSfx?: Sound;
    ctcSfx?: Sound;
    game: RJS;
    config: {
        id: string;
        x: number;
        y: number;
        asset: string;
        sfx: string;
        text: {
            x: number;
            y: number;
            lineSpacing: number;
            style: any;
        };
        ctc: {
            x: number;
            y: number;
            asset: string;
            sfx: string;
            animationStyle: string;
        };
        alwaysOn: boolean;
    };
    constructor(game: RJS, config: any);
    destroy(): void;
    show(text: any, sfx: any): Promise<any>;
    clear(): void;
}
