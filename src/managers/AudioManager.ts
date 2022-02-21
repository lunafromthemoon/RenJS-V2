import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';

export type CurrentAudio = {
    bgm: Phaser.Sound | null;
    bgs: Phaser.Sound | null;
}

export type ActiveAudio = {
    bgm: {key:string,looped:boolean,fromSeconds:number|null,transition:string}|null;
    bgs: {key:string,looped:boolean,fromSeconds:number|null,transition:string}|null;
}

const AUDIO_TYPES: ('bgm' | 'bgs')[] = ['bgm', 'bgs'];

export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type?: 'bgm'|'bgs', looped?: boolean, fromSeconds?: number | null, transition?: string): void;
    stop (type: string, transition: string): void;
    playSFX (key: string): void;
    isMusic(actor: string): boolean;
    isSfx(actor: string): boolean;
    decodeAudio(audioList: string[]): Promise<void>;
    mute(mute: boolean): void;
    changeVolume(): void;
    stopAll(): void;
    getActive(): ActiveAudio;
    current: CurrentAudio;
    // audioLoaded: boolean;
}

export default class AudioManager implements AudioManagerInterface {
    current: CurrentAudio = { bgm: null, bgs: null };
    active: ActiveAudio = { bgm: null, bgs: null };

    private sfxCache: {[key: string]: Phaser.Sound} = {};
    // audioLoaded: boolean;
    private game: RJS
    private unavailableAudio: string[] = [];

    constructor(game: RJS) {
        this.game = game
        this.changeVolume()
    }

    getActive(): ActiveAudio {
       return this.active;
    }

    play (key:string,type:'bgm'|'bgs'='bgm',looped=false,fromSeconds:number|null=null,transition='FADE',force=false): void {
        if (!force && this.current[type] && this.current[type]?.key === key && this.current[type]?.isPlaying){
            // music is the same, and it's playing, do nothing
            return;
        }
        // stop old music
        this.stop(type,transition);

        if (this.unavailableAudio.includes(key)) {
            console.warn(`Audio related to key ${key} is unavailable for playback.`);
            return;
        }
        // add new music
        const music = this.game.add.audio(key);
        this.active[type] = {
            key,
            looped,
            fromSeconds,
            transition
        }
        this.current[type] = music;
        let marker = ''
        const volume = this.game.userPreferences.get('bgmv');
        if (looped && fromSeconds){
            marker = 'intro';
            // looped = false;
            music.addMarker(marker,0,fromSeconds,undefined,false);
            music.onMarkerComplete.addOnce(()=>{
                music.addMarker('looped',fromSeconds,music.totalDuration-fromSeconds,undefined,true);
                music.play('looped');
                music.volume = volume;
            })
        }

        music.play(marker,0,undefined,looped);
        // volume has to be set after it starts or it will ignore it

        if (transition === 'FADE'){
            music.volume = 0;
            this.game.add.tween(music).to({volume},1500,undefined,true);
        } else {
            music.volume = volume;
        }
    }

    stop(type: 'bgm' | 'bgs', transition = 'FADE'): void {
        const sound = this.current[type];
        if (!sound){
            return;
        }
        if (!this.game.userPreferences.get('muted')) {
            this.stopAudio(sound,transition);
            this.current[type]=null;
            this.active[type]=null;
        }
    }

    stopAudio(audio: Phaser.Sound,transition: string): void{
        if (transition === 'FADE') {
            audio.onFadeComplete.add(()=>{
                audio.destroy();
            })
            audio.fadeOut(1500);
        } else {
            audio.destroy();
        }
    }

    playSFX(key: string, volume?: number): void {
        if (this.unavailableAudio.includes(key)) {
          console.warn(
            `SFX related to key ${key} is unavailable for playback.`
          );
          return;
        }
        if (!this.game.userPreferences.get('muted')){
            const sfx = this.sfxCache[key] ? this.sfxCache[key] : this.game.add.audio(key);
            this.sfxCache[key] = sfx;
            sfx.play();
            sfx.volume= volume ? volume : this.game.userPreferences.get('sfxv');
        }
    }

    set (active: ActiveAudio): void {
        for (const type of AUDIO_TYPES){
            const activeAudio = active[type];
            if (!activeAudio) {
                continue;
            }
            this.play(activeAudio.key,type,activeAudio.looped,activeAudio.fromSeconds,activeAudio.transition);
        }
    }

    changeVolume(): void {
        if (this.current.bgm){
            this.current.bgm.volume = this.game.userPreferences.get('bgmv');
        }
        if (this.current.bgs){
            this.current.bgs.volume = this.game.userPreferences.get('bgmv');
        }
        if (this.game.userPreferences.get('muted')){
            this.game.sound.volume = 0;
        }
    }

    async decodeAudio(audioList: string[]): Promise<void> {
        const availableAudios = audioList.filter(audio => this.game.cache.checkSoundKey(audio));
        this.unavailableAudio = audioList.filter(audio => !this.game.cache.checkSoundKey(audio));

        if (availableAudios.length === 0) return;
        return new Promise(resolve=>{
            this.game.sound.setDecodedCallback(availableAudios, () => {
              // this.audioLoaded = true;
              resolve();
            });
        })

    }

    isMusic(actor: string): boolean {
        return this.game.setup.music && actor in this.game.setup.music
    }

    isSfx(actor: string): boolean {
        return this.game.setup.sfx && actor in this.game.setup.sfx
    }

    mute(mute: boolean): void {
        if (mute){
            this.game.sound.volume = 0;
        } else {
            // unmute
            this.game.sound.volume = this.game.userPreferences.get('bgmv');
        }
        this.game.userPreferences.set('muted',mute)
    }

    stopAll(): void {
        this.stop('bgs','FADE');
        this.stop('bgm','FADE');
    }


}
