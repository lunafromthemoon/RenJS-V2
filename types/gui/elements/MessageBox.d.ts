import RJS from '../../core/RJS';
import { Sprite, Sound } from 'phaser-ce';
import Label from './Label';
export default class MessageBox extends Sprite {
    text: Label;
    ctc?: Sprite;
    textLoop: number;
    punctuationMarks: string[];
    punctuationWait: number;
    defaultSfx?: Sound;
    game: RJS;
    config: {
        id: string;
        x: number;
        y: number;
        asset: string;
        sfx: string;
        transition?: string;
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
    onCharacter?: (characters: string[], index: number) => void;
    destroy(): void;
    show(text: any, sfx?: any): Promise<any>;
    hide(transitionName?: any): Promise<void>;
    clear(transitionName?: any): Promise<void>;
}
