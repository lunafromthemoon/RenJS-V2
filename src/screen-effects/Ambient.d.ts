import RJSScreenEffectInterface from './RJSScreenEffect';
import { Animation, Sprite } from 'phaser-ce';
import Emitter = Phaser.Particles.Arcade.Emitter;
import RJS from '../core/RJS';
export default class Ambient implements RJSScreenEffectInterface {
    emitters: Emitter[];
    clearFunctions: any[];
    maxLifespan: number;
    animation: Animation;
    spriteParent: Sprite;
    drugsFlag: number;
    private game;
    private audioManager;
    private storyManager;
    constructor(game: RJS);
    addEmitter(options: any): number;
    BGS(sound: string): void;
    CLEAR(): void;
    STATIC(): void;
    RAIN(): void;
    SAKURA(): void;
    BADTRIP(): void;
    SNOW(): void;
}
