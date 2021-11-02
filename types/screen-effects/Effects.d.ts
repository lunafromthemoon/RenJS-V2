import RJSScreenEffectInterface from './RJSScreenEffect';
import RJS from '../core/RJS';
export default class Effects implements RJSScreenEffectInterface {
    private game;
    private audioManager;
    private tweenManager;
    private gui;
    constructor(game: RJS);
    SHAKE(): Promise<void>;
    ROLLINGCREDITS(params: {
        /** lines to show in credits roll */
        text: string[];
        /** music id */
        music?: string;
        timePerLine?: number;
        endGame?: boolean;
    }): Promise<void>;
    FLASHIMAGE(params: any): Promise<void>;
}
