import RJS from '../core/RJS';
import { RJSSpriteManagerInterface } from './RJSManager';
export interface CGSManagerInterface extends RJSSpriteManagerInterface {
    cgs: object;
    current: object;
    hideAll(transition: string): any;
    show(name: string, transition: () => any, props: any): any;
    hide(name: any, transition: any): Promise<any>;
}
export default class CGSManager implements CGSManagerInterface {
    cgs: object;
    current: object;
    private transition;
    private game;
    private storyManager;
    private tweenManager;
    constructor(game: RJS);
    set(current: any): Promise<void>;
    hideAll(transition?: string): Promise<any>;
    show(name: any, transitionName: any, props: any): Promise<any>;
    animate(name: any, toAnimate: any, time: any): Promise<void>;
    hide(name: any, transitionName: any): Promise<void>;
    isCGS(actor: any): boolean;
}
