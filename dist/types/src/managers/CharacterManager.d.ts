import { RJSSpriteManagerInterface } from './RJSManager';
import Transition from '../screen-effects/Transition';
import RJS from '../core/RJS';
export interface CharacterManagerInterface extends RJSSpriteManagerInterface {
    characters: {
        [key: string]: any;
    };
    showing: object;
    hideAll(transition: string): Promise<void>;
    show(name: string, transitionName?: string, props?: any): any;
    hide(name: string, transitionName?: string): Promise<void>;
    isCharacter(actor: string): boolean;
}
export default class CharacterManager implements CharacterManagerInterface {
    private game;
    characters: {
        [key: string]: any;
    };
    transition?: Transition;
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
    set(showing: {
        [key: string]: any;
    }): Promise<any>;
    show(name: string, transitionName?: string, props?: any): Promise<any>;
    hide(name: string, transitionName?: string): Promise<void>;
    hideAll(transitionName?: string): Promise<void>;
    isCharacter(actor: string): boolean;
}
