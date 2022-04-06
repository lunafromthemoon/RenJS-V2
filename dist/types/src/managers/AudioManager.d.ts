import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
export declare type CurrentAudio = {
    [key: string]: Phaser.Sound | null;
};
export declare type ActiveAudio = {
    [key: string]: {
        key: string;
        looped: boolean;
        fromSeconds: number | null;
        transition: string;
    } | null;
};
export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type?: string, looped?: boolean, fromSeconds?: number | null, transition?: string): void;
    stop(type: string, transition: string): void;
    playSFX(key: string): void;
    isMusic(actor: string): boolean;
    isSfx(actor: string): boolean;
    decodeAudio(audioList: string[]): Promise<void>;
    mute(mute: boolean): void;
    changeVolume(): void;
    stopAll(): void;
    getActive(): ActiveAudio;
    current: CurrentAudio;
}
export default class AudioManager implements AudioManagerInterface {
    current: CurrentAudio;
    active: ActiveAudio;
    private sfxCache;
    private game;
    private unavailableAudio;
    constructor(game: RJS);
    getActive(): ActiveAudio;
    play(key: string, type?: string, looped?: boolean, fromSeconds?: number | null, transition?: string, force?: boolean): void;
    stop(type: string, transition?: string): void;
    stopAudio(audio: Phaser.Sound, transition: string): void;
    playSFX(key: string, volume?: number): void;
    set(active: ActiveAudio): void;
    changeVolume(): void;
    decodeAudio(audioList: string[]): Promise<void>;
    isMusic(actor: string): boolean;
    isSfx(actor: string): boolean;
    mute(mute: boolean): void;
    stopAll(): void;
}
