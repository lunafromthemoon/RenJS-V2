import { Sprite } from 'phaser-ce';
export interface CharacterInterface {
    name: string;
    speechColour: any;
    looks: object;
    lastScale: number;
    currentLook?: any;
    addLook(lookName: any, image: any): void;
}
export default class Character implements CharacterInterface {
    name: string;
    speechColour: any;
    looks: {};
    currentLook: any;
    lastScale: 1;
    constructor(name: any, speechColour: any);
    addLook(look: Sprite): void;
}
