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
    getActive():object;
    current: {
        bgm: Phaser.Sound;
        bgs: Phaser.Sound;
    };
    // audioLoaded: boolean;
}

export default class AudioManager implements AudioManagerInterface {
    current = { bgm: null, bgs: null };
    // audioLoaded: boolean;
    private game: RJS

    constructor(game: RJS) {
        this.game = game
        this.changeVolume("bgm",game.userPreferences.bgmv)
    }

    getActive():object{
       return { 
            bgm: (this.current.bgm) ? this.current.bgm.key : null, 
            bgs: (this.current.bgs) ? this.current.bgs.key : null 
        };
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
            let sfx = this.game.sound.play(key,this.game.userPreferences.sfxv);
        }
    }

    set (active): void {
        if (active.bgm){
            this.play(active.bgm,'bgm',true,'FADE');
        }
        if (active.bgs){
            this.play(active.bgs,'bgs',true,'FADE');
        }

    }

    changeVolume(type, volume): void {
        this.game.sound.volume = volume;
    }

    async decodeAudio(audioList:string[]):Promise<any> {
        if (audioList.length==0) return;
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
                this.current.bgm.play('',0,1,true);
            }
            if (this.current.bgs) {
                this.current.bgs.play('',0,1,true);
            }
        } else {
            if (this.current.bgm) {
                this.current.bgm.stop();
            }
            if (this.current.bgs) {
                this.current.bgs.stop();
            }
        }
        this.game.userPreferences.setPreference('muted',!this.game.userPreferences.muted)
    }

    stopAll(): void {
        this.stop('bgs','FADE');
        this.stop('bgm','FADE');
    }


}
