import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';

export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type: string, looped: boolean, transition: string): void;
    stop (type: string, transition: string): void;
    playSFX (key: string): void;
    isMusic(actor): boolean;
    isSfx(actor): boolean;
    decodeAudio(audioList): Promise<any>;
    mute(): void;
    changeVolume(type, volume): void;
    stopAll(): void;
    current: {
        bgm: Phaser.Sound;
        bgs: Phaser.Sound;
    };
    // audioLoaded: boolean;
    sfx: object;
    musicList: object;
}

export default class AudioManager implements AudioManagerInterface {
    current = { bgm: null, bgs: null };
    // audioLoaded: boolean;
    musicList: object = {};
    sfx: object = {};
    private game: RJS

    constructor(game: RJS) {
        this.game = game
        this.changeVolume("bgm",game.userPreferences.bgmv)
    }

    play (key,type,looped,transition): void {
        if (looped === undefined){
            looped = true;
        }
        // stop old music
        this.stop(type,transition);
        // add new music
        this.current[type] = this.game.add.audio(key);
        if (!this.game.userPreferences.muted) {
            if (transition === 'FADE') {
                this.current[type].fadeIn(1500,looped);
            } else {
                this.current[type].play('',0,1,looped);
            }
        }
    }

    stop(type: string, transition: string): void {
        if (!this.current[type]){
            return;
        }
        if (!this.game.userPreferences.muted) {
            this.stopAudio(this.current[type],transition);
            this.current[type]=null;
        }
    }

    stopAudio(audio: Phaser.Sound,transition: string){
        if (transition === 'FADE') {
            audio.onFadeComplete.add(()=>{
                audio.destroy();
            })
            audio.fadeOut(1500);
        } else {
            audio.destroy();
        }
    }

    playSFX(key): void {
        if (!this.game.userPreferences.muted){
            const sfx = this.game.sound.play(key,this.game.userPreferences.sfxv);
            sfx.onStop.addOnce(()=>{
                sfx.destroy();
            })
        }
    }

    set (current): void {
        this.current = current;
        if (current.bgm){
            this.play(current.bgm,'bgm',true,'FADE');
        }
        if (current.bgs){
            this.play(current.bgs,'bgs',true,'FADE');
        }

    }

    changeVolume(type, volume): void {
        this.game.sound.volume = volume;
    }

    async decodeAudio(audioList:string[]):Promise<any> {
        // if (this.game.setup.music){

        //     Object.keys(this.game.setup.music).forEach(key => {
        //         this.musicList[key] = this.game.add.audio(key);
        //         audioList.push(this.musicList[key]);
        //     },this);
        // }
        // if (this.game.setup.sfx){
        //     Object.keys(this.game.setup.sfx).forEach(key => {
        //         this.sfx[key] = this.game.add.audio(key);
        //         audioList.push(this.sfx[key]);
        //     });
        // }
        return new Promise(resolve=>{
            this.game.sound.setDecodedCallback(audioList, () => {
                // this.audioLoaded = true;
                resolve();
            });
        })
        
    }

    isMusic(actor): boolean {
        return actor in this.game.setup.music
    }

    isSfx(actor): boolean {
        return actor in this.game.setup.sfx
    }

    mute(): void {
        if (this.game.userPreferences.muted){
            if (this.current.bgm) {
                this.musicList[this.current.bgm].play('',0,1,true);
            }
            if (this.current.bgs) {
                this.musicList[this.current.bgs].play('',0,1,true);
            }
        } else {
            if (this.current.bgm) {
                this.musicList[this.current.bgm].stop();
            }
            if (this.current.bgs) {
                this.musicList[this.current.bgs].stop();
            }
        }
        this.game.userPreferences.setPreference('muted',!this.game.userPreferences.muted)
    }

    stopAll(): void {
        this.stop('bgs','FADE');
        this.stop('bgm','FADE');
    }


}
