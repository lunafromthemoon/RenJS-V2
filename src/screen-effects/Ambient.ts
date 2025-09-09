import RJSScreenEffectInterface from './RJSScreenEffect';
import { AudioManagerInterface } from '../managers/AudioManager';
import Emitter = Phaser.Particles.Arcade.Emitter;
import RJS from '../core/RJS';

export class Ambient implements RJSScreenEffectInterface {
    clearFunctions = []

    private game: RJS
    private audioManager: AudioManagerInterface
    public current: string[] = []

    constructor(game: RJS) {
        this.game = game
        this.audioManager = game.managers.audio
    }

    start(name: string): void{
        // start ambient from here or from plugin
        this.current.push(name);
        if (this[name]){
            this[name]();
        } else if (this.game.pluginsRJS[name]){
            this.game.pluginsRJS[name].onCall();
        }
    }

    set(ambients: []): void{
        if(!ambients) return;
        // set ambients after loading game
        for (const ambient of ambients) {
            this.start(ambient);
        }
    }

    addEmitter (options,params): Emitter {
        const emitter = this.game.add.emitter(this.game.world.centerX, -32, options.maxParticles);
        emitter.width = this.game.world.width * 1.5;
        emitter.makeParticles(options.sprite, options.frames);
        if (options.scale){
            emitter.maxParticleScale = options.scale[1];
            emitter.minParticleScale = options.scale[0];
        }
        if (options.speed && options.speed.y){
            emitter.setYSpeed(options.speed.y[0], options.speed.y[1]);
        }
        if (options.speed && options.speed.x){
            emitter.setXSpeed(options.speed.x[0], options.speed.x[1]);
        }
        emitter.gravity = options.gravity ? options.gravity : 0;
        if (options.rotation) {
            emitter.minRotation = options.rotation[0];
            emitter.maxRotation = options.rotation[1];
        }

        emitter.start(...params)
        return emitter;
    }

    destroyEmitters(emitters,maxLifespan): void{
        emitters.forEach( emitter => emitter.on = false);
        setTimeout(() => {
            emitters.forEach( emitter => emitter.destroy());
            emitters = [];
        }, maxLifespan * 2);
    }

    BGS (sound: string): void {
        this.audioManager.play(sound, 'bgs', true,null, 'FADE');
    }

    CLEAR (): void {
        this.clearFunctions.forEach(func => func())
        this.clearFunctions = [];
        this.current = [];
    }

    RAIN (): void {
        this.audioManager.play('rainBGS','bgs',true,null,'FADE');
        const maxLifespan = 1600;
        const emitter = this.addEmitter({
            maxParticles: 400,
            sprite:'rain',
            frames: [0],
            scale: [0.1,0.5],
            speed: {y:[300,500],x:[-5,5]},
            rotation: [0,0]
        },[false, maxLifespan, 5, 0]);
        this.clearFunctions.push(()=>{
            this.destroyEmitters([emitter],maxLifespan);
            this.audioManager.stop('bgs','FADE');
        })
    }

    SAKURA (): void {
        const maxLifespan = 6000;
        const e1 = this.addEmitter({
            maxParticles: 200,
            sprite:'sakura',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2,0.6],
            speed: {y:[20,100],x:[120,150]},
            rotation: [0,40]
        },[false, maxLifespan, 20]);

        const e2 = this.addEmitter({
            maxParticles: 150,
            sprite:'sakura',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8,1.2],
            speed: {y:[50,150],x:[100,120]},
            rotation: [0,40]
        },[false, maxLifespan, 20]);

        this.clearFunctions.push(()=>{
            this.destroyEmitters([e1,e2],maxLifespan);
        })

    }

    SNOW (): void {
        const maxLifespan = 6000;
        const e1 = this.addEmitter({
            maxParticles: 200,
            sprite:'snowflakes',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2,0.6],
            speed: {y:[20,100]},
            rotation: [0,40],
        },[false, 6000, 20]);

        const e2 = this.addEmitter({
            maxParticles: 150,
            sprite:'snowflakes',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8,1.2],
            speed: {y:[50,150]},
            rotation: [0,40],
        },[false, 5000, 40]);
        const e3 = this.addEmitter({
            maxParticles: 150,
            sprite:'snowflakes_large',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.5,1],
            speed: {y:[100,200]},
            rotation: [0,40],
        },[false, 4000, 1000]);
        this.clearFunctions.push(()=>{
            this.destroyEmitters([e1,e2,e3],maxLifespan);
        })
    }
}

export default Ambient