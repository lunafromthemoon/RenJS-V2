import { RJSSpriteManagerInterface } from './RJSManager';
import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
export interface BackgroundManagerInterface<T> extends RJSSpriteManagerInterface {
    backgrounds: object;
    current?: object;
    add(name: any, animated: any, framerate: any): void;
    show(name: any, transition: any): any;
    hide(bg: any, transition: any): any;
    isBackground(actor: any): boolean;
}
export default class BackgroundManager implements BackgroundManagerInterface<Group> {
    private game;
    private transition;
    backgrounds: {};
    current: any;
    constructor(game: RJS);
    add(name: any, animated?: any, framerate?: any): void;
    set(name: any): void;
    show(name: any, transitionName: any): Promise<any>;
    hide(bg?: any, transitionName?: string): Promise<any>;
    isBackground(actor: any): boolean;
}
