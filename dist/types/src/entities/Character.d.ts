import { Sprite, Sound } from 'phaser-ce';
import MessageBox from '../gui/elements/MessageBox';
export interface CharacterInterface {
    keyName: string;
    config: {
        displayName: string;
        color: string;
        voice: string;
        nameBox: string;
        messageBox: string;
    };
    voice: Sound;
    currentLook: Sprite;
    usePortraits: boolean;
    createLook(props: {
        look?: string;
        position?: {
            x: number;
            y: number;
        };
        flipped?: any;
    }): Sprite;
}
export default class Character implements CharacterInterface {
    private game;
    keyName: any;
    config: {
        displayName: string;
        color: string;
        voice: string;
        nameBox: string;
        messageBox: string;
    };
    currentLook: any;
    usePortraits: boolean;
    voice: any;
    constructor(game: any, keyName: any, config: any, hasPortrait?: any);
    createPortrait(portrait: string, parent: MessageBox): void;
    createLook(props?: {
        look?: string;
        position?: {
            x: number;
            y: number;
        };
        flipped?: any;
    }): Sprite;
    resetLook(): void;
    getLookData(): {
        look: string;
        position: {
            x: number;
            y: number;
        };
        flipped: boolean;
    };
}
