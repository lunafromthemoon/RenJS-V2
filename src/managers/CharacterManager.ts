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
    transition: Transition

    constructor(private game: RJS) {
        // this.characters = this.game.setup.characters;
        this.loadCharacters();
    }

    getDefaultTransition(): string{
        return this.game.storyConfig.transitions.defaults.characters;
    }

    loadCharacters(){
        if (!this.game.setup.characters) return;
        for (const name in this.game.setup.characters){
            const characterData = this.game.setup.characters[name];
            // for compatibility, speechColour is deprecated now
            if (characterData.speechColour) {
                characterData.color = characterData.speechColour;
            }
            this.characters[name] = new Character(this.game,name,characterData,characterData.portraits)
        }
    }

    get showing(): { [key:string]: {look: string, position: {x:number,y:number}, flipped: boolean}}{
        const showing = {}
        for( const name in this.characters){
            if (this.characters[name].currentLook){
                showing[name] = this.characters[name].getLookData();
            }
        }
        return showing;
    }

    async set (showing): Promise<any> {
        await this.hideAll(Transition.CUT);
        for (const name in showing) {
            const props = showing[name];
            // for compatibility with older version
            if (props.scaleX) {
                props.flipped = props.scaleX == -1;
            }
            this.characters[name].createLook(props);
            this.characters[name].currentLook.alpha = 1;
        }
    }

    async show(name, transitionName?, props?): Promise<any> {
        const character = this.characters[name];
        // grab old look to transition
        const oldLook = character.currentLook;
        // create new look with new properties
        const newLook = character.createLook(props);
        if (!transitionName) {
            transitionName = this.getDefaultTransition();
        }
        await this.transition.get(transitionName)(oldLook, newLook, {x:newLook.x,y:newLook.y},newLook.scale.x);
        if (oldLook) oldLook.destroy();
    }

    async hide(name, transitionName): Promise<any> {
        if (!transitionName) {
            transitionName = this.getDefaultTransition();
        }
        const ch = this.characters[name];
        const oldLook = ch.currentLook;
        ch.lastScale = 1;
        ch.currentLook = null;
        delete this.showing[name];
        await this.transition.get(transitionName)(oldLook,null);
        if (oldLook) oldLook.destroy();
    }

    async hideAll(transitionName?): Promise<any> {
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
