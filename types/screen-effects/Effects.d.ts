import RJSScreenEffectInterface from './RJSScreenEffect';
import RJS from '../core/RJS';
export default class Effects implements RJSScreenEffectInterface {
    private game;
    private audioManager;
    private tweenManager;
    private gui;
    constructor(game: RJS);
    SHAKE(): Promise<void>;
    ROLLINGCREDITS(params: any): Promise<void>;
    SHOWTITLE(param: any): Promise<void>;
    FLASHIMAGE(imageName: string): Promise<void>;
    EXPLOSION(): Promise<void>;
    THUNDER(): Promise<void>;
    ATTACK(): Promise<void>;
    MULTIATTACK(): Promise<void>;
    CHAINATTACK(): Promise<void>;
}
