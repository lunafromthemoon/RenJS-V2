import RJSManagerInterface from './RJSManager';
import Transition from '../screen-effects/Transition';
import Character from '../entities/Character';
import RJS from '../core/RJS';
export interface CharacterManagerInterface extends RJSManagerInterface {
    characters: object;
    showing: object;
    hideAll(transition: string): any;
    add(name: any, displayName: any, speechColour: any, looks: any): void;
    show(name: any, transition: any, props: any): any;
    hide(name: any, transition: any): Promise<any>;
    isCharacter(actor: any): boolean;
}
export default class CharacterManager implements CharacterManagerInterface {
    characters: {};
    showing: {};
    private transition;
    private game;
    constructor(game: RJS, transition: Transition);
    add(name: any, displayName: any, speechColour: any, looks: any): void;
    addLook(character: Character, lookName: any, image: any): void;
    set(showing: any): Promise<any>;
    show(name: any, transition: any, props: any): any;
    hide(name: any, transition: any): Promise<any>;
    hideAll(transition?: string): Promise<any>;
    isCharacter(actor: any): boolean;
}
