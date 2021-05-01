import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';

export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type: string, looped: boolean, fromSeconds:number, transition: string): void;
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
    active = { bgm: null, bgs: null };

    private sfxCache = {};
    // audioLoaded: boolean;
    private game: RJS

    constructor(game: RJS) {
        this.game = game
        this.changeVolume("bgm",game.userPreferences.bgmv)
    }

    getActive():object{
       return this.active;
    }

    play (key,type='bgm',looped=false,fromSeconds=null,transition='FADE',force=false): void {
        if (!force && this.current[type] && this.current[type].key == key){
            // music is the same, do nothing
            return;
        }
        // stop old music
        this.stop(type,transition);
        // add new music
        const music = this.game.add.audio(key);
        this.active[type] = {
            key: key,
            looped: looped,
            fromSeconds: fromSeconds,
            transition: transition
        }
        this.current[type] = music;
        if (!looped){
            music.onStop.addOnce(()=>{
                this.current[type] = null;
                this.active[type] = null;
            })
        }
        let marker = ''
        if (looped && fromSeconds){
            marker = 'intro';
            // looped = false;
            music.addMarker(marker,0,fromSeconds,null,false);
            music.onMarkerComplete.addOnce(()=>{
                music.addMarker("looped",fromSeconds,music.totalDuration-fromSeconds,null,true);
                music.play("looped");
                music.volume = this.game.userPreferences.bgmv;
            })
        }

        music.play(marker,0,null,looped);
        // volume has to be set after it starts or it will ignore it
        if (transition == 'FADE'){
            music.volume = 0;
            this.game.add.tween(music).to({volume: this.game.userPreferences.bgmv},1500,null,true);
        } else {
            music.volume = this.game.userPreferences.bgmv;
        }
    }

    stop(type: string, transition: string = 'FADE'): void {
        if (!this.current[type]){
            return;
        }
        if (!this.game.userPreferences.muted) {
            this.stopAudio(this.current[type],transition);
            this.current[type]=null;
            this.active[type]=null;
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
            const sfx = this.sfxCache[key] ? this.sfxCache[key] : this.game.add.audio(key);
            this.sfxCache[key] = sfx;
            sfx.play();
            sfx.volume=this.game.userPreferences.sfxv;
        }
    }

    set (active): void {
        for (let type in ['bgm','bgs']){
            if (!active[type]) continue;
            this.play(active[type].key,type,active[type].looped,active[type].fromSeconds,active[type].transition);
        }
    }

    changeVolume(type, volume): void {
        if (this.current.bgm){
            this.current.bgm.volume = this.game.userPreferences.bgmv;
        }
        if (this.current.bgs){
            this.current.bgs.volume = this.game.userPreferences.bgmv;
        }
        
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
            this.game.sound.volume = this.game.userPreferences.bgmv;
        } else {
            this.game.sound.volume = 0;
        }
        this.game.userPreferences.setPreference('muted',!this.game.userPreferences.muted)
    }

    stopAll(): void {
        this.stop('bgs','FADE');
        this.stop('bgm','FADE');
    }


}
