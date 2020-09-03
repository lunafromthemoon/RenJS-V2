import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';
export interface CGSManagerInterface extends RJSManagerInterface {
    cgs: object;
    current: object;
    hideAll(transition: string): any;
    show(name: string, transition: () => any, props: any): any;
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
    show(name: any, transition: any, props: any): any;
    animate(name: any, toAnimate: any, time: any): Promise<void>;
    hide(name: any, transition: any): Promise<void>;
    isCGS(actor: any): boolean;
}
