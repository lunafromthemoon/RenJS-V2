import { RJSSpriteManagerInterface } from './RJSManager';
import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
export interface BackgroundManagerInterface<T> extends RJSSpriteManagerInterface {
    backgrounds: object;
    current?: object;
    createBackground(name: any): void;
    show(name: any, transitionName: any): any;
    hide(bg: any, transitionName: any): any;
    isBackground(actor: any): boolean;
}
export default class BackgroundManager implements BackgroundManagerInterface<Group> {
    private game;
    backgrounds: {};
    current: any;
    constructor(game: RJS);
    createBackground(name: any): void;
    set(name: any): void;
    show(name: any, transitionName: any): Promise<any>;
    hide(bg?: any, transitionName?: string): Promise<any>;
    isBackground(actor: any): boolean;
}
