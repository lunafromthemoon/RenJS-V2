import {Sprite,Sound} from 'phaser-ce';

export interface CharacterInterface {
    keyName: string
    name: string;
    speechColour: any;
    lastScale: number;
    currentLook?: any;
    voice: any;
    nameBox: string;
}

export default class Character implements CharacterInterface {
    keyName: string
    name: string
    speechColour: any
    currentLook = null
    lastScale = 1;
    voice = null;
    nameBox = 'default';
    constructor(keyName,name?, speechColour?,voice?,nameBox = 'default') {
        this.keyName = keyName
        this.name = name
        this.speechColour = speechColour
        this.voice = voice;
        this.nameBox = nameBox;
    }



}
