import {RJSSpriteManagerInterface} from './RJSManager';
import Transition from '../screen-effects/Transition';
import Character from '../entities/Character';
import RJS from '../core/RJS';
import {Sprite} from 'phaser-ce';

export interface CharacterManagerInterface extends RJSSpriteManagerInterface {
    characters: object;
    showing: object;
    hideAll(transition: string);
    // add(name, displayName, speechColour, looks): void;
    show(name, transition, props): any;
    hide(name, transition): Promise<any>;
    isCharacter(actor): boolean;
}



export default class CharacterManager implements CharacterManagerInterface {

    characters = {};
    showing = {};
    transition: Transition

    constructor(private game: RJS) {
        // this.characters = this.game.setup.characters;
        for (const name in this.game.setup.characters){
            const character = this.game.setup.characters[name];
            const displayName = character.displayName ? character.displayName : name;
            let voice = null;
            if (character.voice){
                voice = this.game.add.audio(character.voice);
                // play silently once so we have the duration set
                voice.volume = 0;
                voice.play();
                voice.stop();
                voice.volume = 1;
            }
            // this.add(name,displayName,character.speechColour,character.looks);
            this.characters[name] = new Character(name,displayName,character.speechColour,voice);
        }
    }

    // add (name, displayName, speechColour, looks): void {
        // this.characters[name] = new Character(displayName,speechColour);
        // for (const look in looks) {
            // this.addLook(this.characters[name],look,name+'_'+look);
        // }
    // }

    createLook (character: Character, lookName): Sprite {
        const imgKey = character.keyName+'_'+lookName
        const look: Sprite = this.game.managers.story.characterSprites.create(this.game.storyConfig.positions.DEFAULT.x, this.game.storyConfig.positions.DEFAULT.y, imgKey);
        look.anchor.set(0.5,1);
        look.alpha = 0;
        look.name = lookName;
        return look;

    }

    async set (showing): Promise<any> {
        await this.hideAll(Transition.CUT);
        this.showing = showing;
        for (const name in this.showing) {
            const props = this.showing[name];
            const character = this.characters[name];
            character.currentLook = this.createLook(character,props.look);
            character.currentLook.x = props.position.x;
            character.currentLook.y = props.position.y;
            character.currentLook.scale.x = props.scaleX;
            character.currentLook.alpha = 1;
        }
    }

    show(name, transitionName, props): Promise<any> {
        const ch = this.characters[name];
        const oldLook = ch.currentLook;
        const newLook = props.look ? props.look : "normal"
        ch.currentLook = this.createLook(ch,newLook);

        if (!props.position){
            props.position = (oldLook !== null) ? {x:oldLook.x,y:oldLook.y} : this.game.storyConfig.positions.DEFAULT;
        }
        if (props.flipped !== undefined){
            if (props.flipped === 'flip'){
                ch.lastScale *= -1; 
            } else {
                ch.lastScale = props.flipped ? -1 : 1;
            }
        }
        this.showing[name] = {look: ch.currentLook.name,position:props.position,scaleX: ch.lastScale};
        let transitioning: Promise<any> = this.transition.get(transitionName)(oldLook, ch.currentLook, props.position, ch.lastScale);
        transitioning.then(()=>{
            if (oldLook) oldLook.destroy();
        })
        return transitioning;
    }

    async hide(name, transitionName): Promise<any> {
        const ch = this.characters[name];
        const oldLook = ch.currentLook;
        ch.lastScale = 1;
        ch.currentLook = null;
        delete this.showing[name];
        let transitioning: Promise<any> = this.transition.get(transitionName)(oldLook,null);
        transitioning.then(()=>{
            if (oldLook) oldLook.destroy();
        })
        return transitioning;
    }

    async hideAll(transitionName?): Promise<any> {
        if (!transitionName){
            transitionName = () => this.transition.FADEOUT;
        }
        const promises = []
        for (const char in this.showing){
            promises.push(this.hide(char,transitionName));
        }
        return Promise.all(promises)
    }

    isCharacter(actor): boolean {
        return actor in this.characters || actor === 'CHARS' || actor === 'ALL';
    }

}
