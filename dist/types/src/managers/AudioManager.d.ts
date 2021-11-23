import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type: string, looped: boolean, fromSeconds: number, transition: string): void;
    stop(type: string, transition: string): void;
    playSFX(key: string): void;
    isMusic(actor: any): boolean;
    isSfx(actor: any): boolean;
    decodeAudio(audioList: any): Promise<any>;
    mute(mute: boolean): void;
    changeVolume(volume: any): void;
    stopAll(): void;
    getActive(): object;
    current: {
        bgm: Phaser.Sound;
        bgs: Phaser.Sound;
    };
}
export default class AudioManager implements AudioManagerInterface {
    current: {
        bgm: any;
        bgs: any;
    };
    active: {
        bgm: any;
        bgs: any;
    };
    private sfxCache;
    private game;
    private unavailableAudio;
    constructor(game: RJS);
    getActive(): object;
    play(key: any, type?: string, looped?: boolean, fromSeconds?: any, transition?: string, force?: boolean): void;
    stop(type: string, transition?: string): void;
    stopAudio(audio: Phaser.Sound, transition: string): void;
    playSFX(key: any, volume?: any): void;
    set(active: any): void;
    changeVolume(): void;
    decodeAudio(audioList: string[]): Promise<any>;
    isMusic(actor: any): boolean;
    isSfx(actor: any): boolean;
    mute(mute: boolean): void;
    stopAll(): void;
}
