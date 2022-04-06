import { Sprite } from 'phaser-ce';
import RJS from '../core/RJS';
import { RJSSpriteManagerInterface } from './RJSManager';
export default class BackgroundManager implements RJSSpriteManagerInterface {
    private game;
    current?: Sprite;
    constructor(game: RJS);
    createBackground(name: string): Sprite;
    set(name: string): void;
    show(name: string | null, transitionName: string): Promise<void>;
    hide(bg?: string, transitionName?: string): Promise<void>;
    isBackground(actor: string): boolean;
}
