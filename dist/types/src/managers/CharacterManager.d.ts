import { RJSSpriteManagerInterface } from './RJSManager';
import Transition from '../screen-effects/Transition';
import RJS from '../core/RJS';
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
    transition: Transition;
    constructor(game: RJS);
    getDefaultTransition(): string;
    loadCharacters(): void;
    get showing(): {
        [key: string]: {
            look: string;
            position: {
                x: number;
                y: number;
            };
            flipped: boolean;
        };
    };
    set(showing: any): Promise<any>;
    show(name: any, transitionName?: any, props?: any): Promise<any>;
    hide(name: any, transitionName: any): Promise<any>;
    hideAll(transitionName?: any): Promise<any>;
    isCharacter(actor: any): boolean;
}
