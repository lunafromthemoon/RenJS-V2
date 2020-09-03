import {Sprite} from 'phaser-ce';

export interface CharacterInterface {
    name: string;
    speechColour: any;
    looks: object;
    lastScale: number;
    currentLook?: any;
    addLook(lookName, image): void;
}

export default class Character implements CharacterInterface {
    name: string
    speechColour: any
    looks = {}
    currentLook = null
    lastScale: 1;
    constructor(name, speechColour) {
        this.name = name
        this.speechColour = speechColour
    }

    addLook (look: Sprite): void {
        this.looks[look.name] = look;
        if (!this.currentLook){
            this.currentLook = this.looks[look.name];
        }

    }

}
