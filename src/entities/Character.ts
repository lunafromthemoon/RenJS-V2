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
    looks: {}
    currentLook = null
    lastScale: 1;
    constructor(name, speechColour) {
        this.name = name
        this.speechColour = speechColour
    }

    // todo move to manager
    // addLook (lookName,image): void{
    //     const look = RenJS.storyManager.characterSprites.create(config.positions.CENTER.x,config.positions.CENTER.y,(image ? image : lookName));
    //     look.anchor.set(0.5,1);
    //     look.alpha = 0;
    //     look.name = lookName;
    //     this.looks[lookName] = look;
    //     if (!this.currentLook){
    //         this.currentLook = this.looks[lookName];
    //     }
    // }

}
