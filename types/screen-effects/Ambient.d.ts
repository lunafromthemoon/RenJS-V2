import RJSScreenEffectInterface from './RJSScreenEffect';
import Emitter = Phaser.Particles.Arcade.Emitter;
import RJS from '../core/RJS';
export default class Ambient implements RJSScreenEffectInterface {
    clearFunctions: any[];
    private game;
    private audioManager;
    constructor(game: RJS);
    addEmitter(options: any, params: any): Emitter;
    destroyEmitters(emitters: any, maxLifespan: any): void;
    BGS(sound: string): void;
    CLEAR(): void;
    RAIN(): void;
    SAKURA(): void;
    SNOW(): void;
}
