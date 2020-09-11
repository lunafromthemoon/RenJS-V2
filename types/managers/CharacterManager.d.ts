import { RJSSpriteManagerInterface } from './RJSManager';
import Character from '../entities/Character';
import RJS from '../core/RJS';
export interface CharacterManagerInterface extends RJSSpriteManagerInterface {
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
    constructor(game: RJS);
    add(name: any, displayName: any, speechColour: any, looks: any): void;
    addLook(character: Character, lookName: any, image: any): void;
    set(showing: any): Promise<any>;
    show(name: any, transitionName: any, props: any): Promise<any>;
    hide(name: any, transitionName: any): Promise<any>;
    hideAll(transition?: any): Promise<any>;
    isCharacter(actor: any): boolean;
}
