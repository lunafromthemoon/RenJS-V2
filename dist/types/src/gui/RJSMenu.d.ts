import RJS from '../core/RJS';
import { Group } from 'phaser-ce';
import MaskSlider from './elements/MaskSlider';
import SaveSlot from './elements/SaveSlot';
import BaseButton from './elements/BaseButton';
import Label from './elements/Label';
export default class RJSMenu extends Group {
    config: any;
    id: string;
    game: RJS;
    elementFactory: {};
    saveSlots: {};
    indexedElements: {
        [key: string]: any;
    };
    backgroundMusic: string;
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
    }): Label;
    createButton(element: {
        x: number;
        y: number;
        asset: string;
        sfx: string;
        binding: string;
        pushButton?: boolean;
        pushed?: boolean;
    }): BaseButton;
    createSlider(element: {
        x: number;
        y: number;
        asset: string;
        binding: string;
        userPreference?: string;
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
    addThumbnail(thumbnail: any, slot: any): void;
    show(): Promise<void>;
    hide(mute?: boolean): Promise<void>;
    destroy(): void;
}
