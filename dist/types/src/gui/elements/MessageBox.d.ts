import RJS from '../../core/RJS';
import { Sprite, Sound } from 'phaser-ce';
import Label from './Label';
export default class MessageBox extends Sprite {
    text: Label;
    ctc?: Sprite;
    portrait?: Sprite;
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
        textAnimation?: string;
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
            animationStyle?: string;
        };
        portrait?: {
            x: number;
            y: number;
        };
        alwaysOn: boolean;
    };
    constructor(game: RJS, config: any);
    onCharacter?: (characters: string[], index: number) => void;
    destroy(): void;
    show(text: string, sfx?: string): Promise<any>;
    getCharacterSfx(sfx?: any): [Sound, number];
    showTextAnimation(textObj: Phaser.Text, finalText: string, sfxConfig?: any): Promise<any>;
    hide(transitionName?: any): Promise<any>;
    clear(transitionName?: any): Promise<any>;
}
