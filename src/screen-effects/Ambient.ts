import RJSScreenEffectInterface from './RJSScreenEffect';
import { AudioManagerInterface } from '../managers/AudioManager';
import {StoryManagerInterface} from '../managers/StoryManager';
import {Animation, Group, Sprite} from 'phaser-ce';
import Emitter = Phaser.Particles.Arcade.Emitter;
import RJS from '../core/RJS';

export default class Ambient implements RJSScreenEffectInterface {
    clearFunctions = []

    private game: RJS
    private audioManager: AudioManagerInterface

    constructor(game: RJS) {
        this.game = game
        this.audioManager = game.managers.audio
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

    destroyEmitters(emitters,maxLifespan){
        emitters.forEach( emitter => emitter.on = false);
        setTimeout(() => {
            emitters.forEach( emitter => emitter.destroy());
            emitters = [];
        }, maxLifespan * 2);
    }

    BGS (sound: string): void {
        this.audioManager.play(sound, 'bgs', true, 'FADE');
    }

    CLEAR (): void {
        this.clearFunctions.forEach(func => func())
        this.clearFunctions = [];
    }

    RAIN (): void {
        this.audioManager.play('rainBGS','bgs',true,'FADE');
        let maxLifespan = 1600;
        let emitter = this.addEmitter({
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
        let maxLifespan = 6000;
        let e1 = this.addEmitter({
            maxParticles: 200,
            sprite:'sakura',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2,0.6],
            speed: {y:[20,100],x:[120,150]},
            rotation: [0,40]
        },[false, maxLifespan, 20]);

        let e2 = this.addEmitter({
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
        let maxLifespan = 6000;
        let e1 = this.addEmitter({
            maxParticles: 200,
            sprite:'snowflakes',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2,0.6],
            speed: {y:[20,100]},
            rotation: [0,40],
        },[false, 6000, 20]);

        let e2 = this.addEmitter({
            maxParticles: 150,
            sprite:'snowflakes',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8,1.2],
            speed: {y:[50,150]},
            rotation: [0,40],
        },[false, 5000, 40]);
        let e3 = this.addEmitter({
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

