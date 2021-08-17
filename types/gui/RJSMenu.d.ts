import RJS from '../core/RJS';
import { Group, Text } from 'phaser-ce';
import MaskSlider from './elements/MaskSlider';
import SaveSlot from './elements/SaveSlot';
export default class RJSMenu extends Group {
    protected config: any;
    id: string;
    game: RJS;
    elementFactory: {};
    indexedElements: {};
    constructor(game: RJS, config: any);
    init(): void;
    createImage(element: {
        x: number;
        y: number;
        asset: string;
    }): Phaser.Sprite;
    createLabel(element: {
        x: number;
        y: number;
        text: string;
        lineSpacing: number;
        style: any;
    }): Text;
    createButton(element: {
        x: number;
        y: number;
        asset: string;
        sfx: string;
        binding: string;
        slot: string;
        pushButton?: boolean;
        pushed?: boolean;
    }): Phaser.Button;
    createSlider(element: {
        x: number;
        y: number;
        asset: string;
        binding: string;
        sfx: string;
        mask?: string;
    }): MaskSlider;
    createSaveSlot(element: {
        x: number;
        y: number;
        asset: string;
        slot: number;
        thumbnail: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    }): SaveSlot;
    show(text: any, color: any): Promise<void>;
    hide(mute: any): Promise<void>;
    destroy(): void;
}
