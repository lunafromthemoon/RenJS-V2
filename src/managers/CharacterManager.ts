import {RJSSpriteManagerInterface} from './RJSManager';
import Transition from '../screen-effects/Transition';
import Character from '../entities/Character';
import RJS from '../core/RJS';

export interface CharacterManagerInterface extends RJSSpriteManagerInterface {
    characters: {[key: string]: any};
    showing: object;
    hideAll(transition: string): Promise<void>;
    // add(name, displayName, speechColour, looks): void;
    show(name: string, transitionName?: string, props?: any): any;
    hide(name: string, transitionName?: string): Promise<void>;
    isCharacter(actor: string): boolean;
}



export class CharacterManager implements CharacterManagerInterface {

    characters: {[key: string]: any} = {};
    transition?: Transition

    constructor(private game: RJS) {
        // this.characters = this.game.setup.characters;
        this.loadCharacters();
    }

    getDefaultTransition(): string{
        return this.game.storyConfig.transitions.defaults.characters;
    }

    loadCharacters(): void{
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

    get showing(): { [key: string]: {look: string; position: {x: number;y: number}; flipped: boolean}}{
        const showing: {[key: string]: any} = {};
        for( const name in this.characters){
            if (this.characters[name].currentLook){
                showing[name] = this.characters[name].getLookData();
            }
        }
        return showing;
    }

    async set (showing: {[key: string]: any}): Promise<any> {
        await this.hideAll(Transition.CUT);
        for (const name in showing) {
            const props = showing[name];
            // for compatibility with older version
            if (props.scaleX) {
                props.flipped = props.scaleX === -1;
            }
            this.characters[name].createLook(props);
            this.characters[name].currentLook.alpha = 1;
        }
    }

    async show(name: string, transitionName?: string, props?: any): Promise<any> {
        const character = this.characters[name];
        // grab old look to transition
        const oldLook = character.currentLook;
        // create new look with new properties
        const newLook = character.createLook(props);
        if (!transitionName) {
            transitionName = this.getDefaultTransition();
        }
        await this.transition?.get(transitionName)(oldLook, newLook, {x:newLook.x,y:newLook.y},newLook.scale.x);
        if (oldLook) oldLook.destroy();
    }

    async hide(name: string, transitionName?: string): Promise<void> {
        if (!transitionName) {
            transitionName = this.getDefaultTransition();
        }
        const ch = this.characters[name];
        const oldLook = ch.currentLook;
        ch.lastScale = 1;
        ch.currentLook = null;
        delete this.showing[name];
        await this.transition?.get(transitionName)(oldLook,null);
        if (oldLook) oldLook.destroy();
    }

    async hideAll(transitionName?: string): Promise<void> {
        const promises = []
        for (const char in this.showing){
            promises.push(this.hide(char,transitionName));
        }
        await Promise.all(promises);
    }

    isCharacter(actor: string): boolean {
        return actor in this.characters || actor === 'CHARS' || actor === 'ALL';
    }

}
export default CharacterManager