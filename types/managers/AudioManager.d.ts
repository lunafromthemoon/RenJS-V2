import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type: string, looped: boolean, transition: string): void;
    stop(type: string, transition: string): void;
    playSFX(key: string): void;
    isMusic(actor: any): boolean;
    isSfx(actor: any): boolean;
    decodeAudio(audioList: any): Promise<any>;
    mute(): void;
    changeVolume(type: any, volume: any): void;
    stopAll(): void;
    current: {
        bgm: Phaser.Sound;
        bgs: Phaser.Sound;
    };
    sfx: object;
    musicList: object;
}
export default class AudioManager implements AudioManagerInterface {
    current: {
        bgm: any;
        bgs: any;
    };
    musicList: object;
    sfx: object;
    private game;
    constructor(game: RJS);
    play(key: any, type: any, looped: any, transition: any): void;
    stop(type: string, transition: string): void;
    stopAudio(audio: Phaser.Sound, transition: string): void;
    playSFX(key: any): void;
    set(current: any): void;
    changeVolume(type: any, volume: any): void;
    decodeAudio(audioList: string[]): Promise<any>;
    isMusic(actor: any): boolean;
    isSfx(actor: any): boolean;
    mute(): void;
    stopAll(): void;
}
