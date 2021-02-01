import {Sprite} from 'phaser-ce';

export interface CharacterInterface {
    keyName: string
    name: string;
    speechColour: any;
    lastScale: number;
    currentLook?: any;
}

export default class Character implements CharacterInterface {
    keyName: string
    name: string
    speechColour: any
    currentLook = null
    lastScale = 1;
    constructor(keyName,name, speechColour) {
        this.keyName = keyName
        this.name = name
        this.speechColour = speechColour
    }



}
