import { RJSSpriteManagerInterface } from './RJSManager';
import Transition from '../screen-effects/Transition';
import Character from '../entities/Character';
import RJS from '../core/RJS';
import { Sprite } from 'phaser-ce';
export interface CharacterManagerInterface extends RJSSpriteManagerInterface {
    characters: object;
    showing: object;
    hideAll(transition: string): any;
    show(name: any, transition: any, props: any): any;
    hide(name: any, transition: any): Promise<any>;
    isCharacter(actor: any): boolean;
}
export default class CharacterManager implements CharacterManagerInterface {
    private game;
    characters: {};
    showing: {};
    transition: Transition;
    constructor(game: RJS);
    createLook(character: Character, lookName: any): Sprite;
    set(showing: any): Promise<any>;
    show(name: any, transitionName: any, props: any): Promise<any>;
    hide(name: any, transitionName: any): Promise<any>;
    hideAll(transitionName?: any): Promise<any>;
    isCharacter(actor: any): boolean;
}
