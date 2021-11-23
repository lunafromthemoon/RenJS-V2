import RJS from '../../core/RJS';
import { Sprite } from 'phaser-ce';
import Label from './Label';
export default class NameBox extends Sprite {
    id: string;
    text: Label;
    game: RJS;
    config: {
        id: string;
        asset: string;
        x: number;
        y: number;
        transition?: string;
        tintStyle?: string;
        text: {
            x: number;
            y: number;
            width: number;
            height: number;
            style: any;
            lineSpacing: number;
        };
    };
    constructor(game: RJS, config: any);
    show(text: string, color: string): Promise<any>;
    hide(transitionName?: string): Promise<any>;
    destroy(): void;
}
