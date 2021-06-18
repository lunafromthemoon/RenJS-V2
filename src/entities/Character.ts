import {Sprite,Sound} from 'phaser-ce';

export interface CharacterInterface {
    keyName: string
    name: string;
    speechColour: any;
    lastScale: number;
    currentLook?: any;
    voice: any;
}

export default class Character implements CharacterInterface {
    keyName: string
    name: string
    speechColour: any
    currentLook = null
    lastScale = 1;
    voice = null;
    constructor(keyName,name, speechColour,voice) {
        this.keyName = keyName
        this.name = name
        this.speechColour = speechColour
        this.voice = voice;
        
    }



}
