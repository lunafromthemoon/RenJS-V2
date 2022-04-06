import Transition from '../screen-effects/Transition';
import RJS from '../core/RJS';
import { RJSSpriteManagerInterface } from './RJSManager';
export interface CGSManagerInterface extends RJSSpriteManagerInterface {
    cgs: {
        [key: string]: any;
    };
    current: {
        [key: string]: any;
    };
    hideAll(transition: string): Promise<void>;
    show(name: string, transitionName: string, props: any): Promise<any>;
    hide(name: string, transitionName: string): Promise<void>;
}
export default class CGSManager implements CGSManagerInterface {
    private game;
    cgs: {
        [key: string]: any;
    };
    current: {
        [key: string]: any;
    };
    transition?: Transition;
    constructor(game: RJS);
    set(current: {
        [key: string]: any;
    }): Promise<void>;
    hideAll(transition?: string): Promise<void>;
    show(name: string, transitionName: string, props: any): Promise<any>;
    animate(name: string, toAnimate: any): Promise<void>;
    hide(name: string, transitionName: string): Promise<void>;
    isCGS(actor: any): boolean;
}
