import RJSScreenEffectInterface from "./RJSScreenEffect";
import RJSGame from "../RJSGame";
import { AudioManagerInterface } from "../managers/AudioManager";
import {StoryManagerInterface} from "../managers/StoryManager";
import {Animation, Sprite} from "phaser-ce";
import Emitter = Phaser.Particles.Arcade.Emitter;

export default class Ambient implements RJSScreenEffectInterface {
    emitters: Emitter[]
    clearFunctions = []
    maxLifespan = 0
    animation: Animation
    spriteParent: Sprite
    drugsFlag: number
    // drugsState: number

    private game: RJSGame
    private audioManager: AudioManagerInterface
    private storyManager: StoryManagerInterface

    constructor(game: RJSGame, audioManager: AudioManagerInterface, storyManager: StoryManagerInterface) {
        this.game = game
        this.audioManager = audioManager
        this.storyManager = storyManager
    }

    addEmitter (options){
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

        emitter.start.apply(options.params)
        return this.emitters.push(emitter);
    }

    BGS (sound: string) {
        this.audioManager.play(sound, "bgs", true, "FADE");
    }

    CLEAR (){
        if (this.maxLifespan){
            this.emitters.forEach( emitter => emitter.on = false);
            setTimeout(() => {
                this.emitters.forEach( emitter => emitter.destroy());
                this.emitters = [];
            }, this.maxLifespan * 2);
            this.maxLifespan = 0;
        }
        if (this.animation){
            this.animation.stop(false,true);
            this.spriteParent.destroy();
        }
        this.clearFunctions.forEach(func => func())
        this.clearFunctions = [];
        this.audioManager.stop("bgs","FADE");
    }

    STATIC () {
        const staticGroup: Sprite = this.storyManager.behindCharactersSprites.create(this.game.world.centerX, this.game.world.centerY, 'static');
        staticGroup.anchor.set(0.5);
        staticGroup.scale.set(2.5);
        this.animation = staticGroup.animations.add('static')
        this.audioManager.play("staticSound","bgs",true,"CUT");
        this.animation.play(10, true,true);
        this.spriteParent = staticGroup;
    }

    RAIN () {
        this.audioManager.play("rain","bgs",true,"FADE");
        this.addEmitter({
            maxParticles: 400,
            sprite:"rain",
            frames: [0],
            scale: [0.1,0.5],
            speed: {y:[300,500],x:[-5,5]},
            rotation: [0,0],
            params: [false, 1600, 5, 0]
        });

        this.maxLifespan = 1600;
    }

    SAKURA () {
        this.addEmitter({
            maxParticles: 200,
            sprite:"sakura",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2,0.6],
            speed: {y:[20,100],x:[120,150]},
            rotation: [0,40],
            params: [false, 6000, 20]
        });

        this.addEmitter({
            maxParticles: 150,
            sprite:"sakura",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8,1.2],
            speed: {y:[50,150],x:[100,120]},
            rotation: [0,40],
            params: [false, 5000, 40]
        });

        this.maxLifespan = 6000;
    }

    BADTRIP () {
        this.drugsFlag = 2;
    }

    // DRUGS () {
    //     const bg = this.storyManager.behindCharactersSprites.create(0,0);
    //     bg.width = globalConfig.w;
    //     bg.height = globalConfig.h;
    //     const fragmentSrc = [
    //         "precision mediump float;",
    //         "uniform float time;",
    //         "uniform vec2 resolution;",
    //         "uniform vec2 mouse;",
    //
    //         "const float Pi = 3.14159;",
    //         "const int zoom = 71;",
    //         "const float speed = .1;",
    //         "float fScale = 1.1;",
    //
    //         "void main(void)",
    //         "{",
    //
    //         "vec2 uv = gl_FragCoord.xy / resolution.xy;",
    //         "vec2 p=(4.0*gl_FragCoord.xy-resolution.xy)/max(resolution.x,resolution.y)+3.*(0.1/time);",
    //
    //         "float ct = time * speed * 2. * mouse[1];",
    //
    //         " for(int i=1;i<zoom;i++) {",
    //         "vec2 newp=p;",
    //         "newp.x+=0.25/float(i)*cos(float(i)*p.y+time*cos(ct)*0.3/40.0+0.03*float(i))*fScale+10.0;        ",
    //         "newp.y+=0.5/float(i)*cos(float(i)*p.x+time*ct*0.3/50.0+0.03*float(i+10))*fScale+15.0;",
    //         "p=newp;",
    //         "}",
    //
    //         "vec3 col=vec3(1.5*sin(1.0*p.x)+0.5, 0.5*cos(3.0*p.y)+0.3, cos(p.x+p.y))-mouse[0];",
    //         "gl_FragColor=vec4(col, 0.0);",
    //         "}"
    //     ];
    //     //  The following properties are available (shown at default values)
    //
    //     //  filter.speed = 10.0;
    //     //  filter.intensity = 0.30;
    //     const filter = new Filter(this.game, null, fragmentSrc);
    //     filter.setResolution(globalConfig.w, globalConfig.h);
    //     bg.filters = [filter];
    //     const counter = 2000;
    //     this.drugsFlag = 1;
    //     this.drugsState = 0;
    //     const interval = setInterval(() => {
    //         const speed = this.drugsFlag == 1 ? 1 : game.rnd.integerInRange(1,10);
    //         filter.update({x:counter,y:speed } );
    //         // console.log(game.input.activePointer.x);
    //         // console.log(counter);
    //         if (this.drugsState == 0){
    //             counter -= 20;
    //             if (counter<=20){
    //                 this.drugsState = 1;
    //             }
    //         } else if (this.drugsState == 2){
    //             counter += 25;
    //             if (counter >= 2200){
    //                 RenJS.storyManager.behindCharactersSprites.remove(bg,true);
    //                 clearInterval(interval);
    //             }
    //         }
    //
    //
    //     }, 60);
    //     this.clearFunctions.push(function(){
    //         this.drugsState = 2;
    //     });
    // }

    SNOW () {
        this.addEmitter({
            maxParticles: 200,
            sprite:"snowflakes",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2,0.6],
            speed: {y:[20,100]},
            rotation: [0,40],
            params: [false, 6000, 20]
        });

        this.addEmitter({
            maxParticles: 150,
            sprite:"snowflakes",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8,1.2],
            speed: {y:[50,150]},
            rotation: [0,40],
            params: [false, 5000, 40]
        });
        this.addEmitter({
            maxParticles: 150,
            sprite:"snowflakes_large",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.5,1],
            speed: {y:[100,200]},
            rotation: [0,40],
            params: [false, 4000, 1000]
        });

        this.maxLifespan = 6000;
    }
}

