import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type: string, looped: boolean, transition: string): void;
    stop(type: string, transition: string): void;
    playSFX(key: string): void;
    isMusic(actor: any): boolean;
    isSfx(actor: any): boolean;
    init(cb: any): void;
    mute(): void;
    changeVolume(type: any, volume: any): void;
    stopAll(): void;
    current: {
        bgm: any;
        bgs: any;
    };
    audioLoaded: boolean;
    sfx: object;
    musicList: object;
}
export default class AudioManager implements AudioManagerInterface {
    current: {
        bgm: any;
        bgs: any;
    };
    audioLoaded: boolean;
    musicList: object;
    sfx: object;
    private game;
    constructor(game: RJS);
    play(key: any, type: any, looped: any, transition: any): void;
    stop(type: string, transition: string): void;
    playSFX(key: any): void;
    set(current: any): void;
    changeVolume(type: any, volume: any): void;
    init(cb: any): void;
    isMusic(actor: any): boolean;
    isSfx(actor: any): boolean;
    mute(): void;
    stopAll(): void;
}
