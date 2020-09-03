import RJSManagerInterface from './RJSManager';
import { Group } from 'phaser-ce';
import Transition from '../screen-effects/Transition';
import RJS from '../core/RJS';
export interface BackgroundManagerInterface<T> extends RJSManagerInterface {
    backgroundSprites: T;
    backgrounds: object;
    current?: object;
    add(name: any, animated: any, framerate: any): void;
    show(name: any, transition: any): any;
    hide(bg: any, transition: any): any;
    isBackground(actor: any): boolean;
}
export default class BackgroundManager implements BackgroundManagerInterface<Group> {
    private game;
    backgroundSprites: Group;
    private transition;
    backgrounds: {};
    current: any;
    constructor(game: RJS, transition: Transition);
    add(name: any, animated?: any, framerate?: any): void;
    set(name: any): void;
    show(name: any, transition: any): Promise<any>;
    hide(bg?: any, transition?: any): Promise<any>;
    isBackground(actor: any): boolean;
}
