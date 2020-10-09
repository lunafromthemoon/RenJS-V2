import {RJSSpriteManagerInterface} from './RJSManager';
import Transition from '../screen-effects/Transition';
import Character from '../entities/Character';
import RJS from '../core/RJS';
import {Sprite} from 'phaser-ce';

export interface CharacterManagerInterface extends RJSSpriteManagerInterface {
    characters: object;
    showing: object;
    hideAll(transition: string);
    add(name, displayName, speechColour, looks): void;
    show(name, transition, props): any;
    hide(name, transition): Promise<any>;
    isCharacter(actor): boolean;
}



export default class CharacterManager implements CharacterManagerInterface {

    characters = {};
    showing = {};
    private transition: Transition
    private game: RJS

    constructor(game: RJS) {
        this.transition = game.screenEffects.transition
        this.game = game
    }

    add (name, displayName, speechColour, looks): void {
        this.characters[name] = new Character(displayName,speechColour);
        for (const look in looks) {
            this.addLook(this.characters[name],look,name+'_'+look);
        }
    }

    addLook (character: Character, lookName, image): void {
        const look: Sprite = this.game.managers.story.characterSprites.create(this.game.storyConfig.positions.CENTER.x, this.game.storyConfig.positions.CENTER.y,(image ? image : lookName));
        look.anchor.set(0.5,1);
        look.alpha = 0;
        look.name = lookName;

        character.addLook(look)

    }

    async set (showing): Promise<any> {
        await this.hideAll(Transition.CUT);
        this.showing = showing;
        for (const name in this.showing) {
            const props = this.showing[name];
            const character = this.characters[name];
            character.currentLook = character.looks[props.look];
            character.currentLook.x = props.position.x;
            character.currentLook.y = props.position.y;
            character.currentLook.scale.x = props.flipped ? -1 : 1;
            character.currentLook.alpha = 1;
        }
    }

    show(name, transitionName, props): Promise<any> {
        const ch = this.characters[name];
        const oldLook = ch.currentLook;
        ch.currentLook = props.look ? ch.looks[props.look] : ch.looks.normal;

        if (!props.position){
            props.position = (oldLook !== null) ? {x:oldLook.x,y:oldLook.y} : this.game.storyConfig.positions.CENTER;
        }
        if (props.flipped !== undefined){
            ch.lastScale = props.flipped ? -1 : 1;
        }
        this.showing[name] = {look: ch.currentLook.name,position:props.position,flipped:(ch.lastScale === -1)};
        return this.transition.get(transitionName)(oldLook, ch.currentLook, props.position, ch.lastScale, this.game.managers.story.characterSprites);
    }

    async hide(name, transitionName): Promise<any> {
        const ch = this.characters[name];
        const oldLook = ch.currentLook;
        ch.currentLook = null;
        delete this.showing[name];
        return this.transition.get(transitionName)(oldLook,null);
    }

    async hideAll(transition?): Promise<any> {
        if (!transition){
            transition = () => this.transition.FADEOUT;
        }
        const promises = []
        for (const char in this.showing){
            promises.push(this.hide(char,transition));
        }
        return Promise.all(promises)
    }

    isCharacter(actor): boolean {
        return actor in this.characters || actor === 'CHARS' || actor === 'ALL';
    }

}
