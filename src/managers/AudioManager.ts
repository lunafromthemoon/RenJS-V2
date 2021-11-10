import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';

export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type: string, looped: boolean, fromSeconds: number, transition: string): void;
    stop (type: string, transition: string): void;
    playSFX (key: string): void;
    isMusic(actor): boolean;
    isSfx(actor): boolean;
    decodeAudio(audioList): Promise<any>;
    mute(mute: boolean): void;
    changeVolume(volume): void;
    stopAll(): void;
    getActive(): object;
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
    private unavailableAudio: string[];

    constructor(game: RJS) {
        this.game = game
        this.changeVolume(game.userPreferences.get('bgmv'))
    }

    getActive(): object{
       return this.active;
    }

    play (key,type='bgm',looped=false,fromSeconds=null,transition='FADE',force=false): void {
        if (!force && this.current[type] && this.current[type].key == key && this.current[type].isPlaying){
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
            music.addMarker(marker,0,fromSeconds,null,false);
            music.onMarkerComplete.addOnce(()=>{
                music.addMarker('looped',fromSeconds,music.totalDuration-fromSeconds,null,true);
                music.play('looped');
                music.volume = volume;
            })
        }

        music.play(marker,0,null,looped);
        // volume has to be set after it starts or it will ignore it

        if (transition == 'FADE'){
            music.volume = 0;
            this.game.add.tween(music).to({volume},1500,null,true);
        } else {
            music.volume = volume;
        }
    }

    stop(type: string, transition = 'FADE'): void {
        if (!this.current[type]){
            return;
        }
        if (!this.game.userPreferences.get('muted')) {
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

    playSFX(key,volume?): void {
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

    set (active): void {
        for (const type of ['bgm','bgs']){

            if (!active[type]) continue;
            this.play(active[type].key,type,active[type].looped,active[type].fromSeconds,active[type].transition);
        }
    }

    changeVolume(volume): void {
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

    async decodeAudio(audioList: string[]): Promise<any> {
        const availableAudios = audioList.filter(audio => this.game.cache.checkSoundKey(audio));
        this.unavailableAudio = audioList.filter(audio => !this.game.cache.checkSoundKey(audio));

        if (availableAudios.length == 0) return;
        return new Promise(resolve=>{
            this.game.sound.setDecodedCallback(availableAudios, () => {
              // this.audioLoaded = true;
              resolve(true);
            });
        })

    }

    isMusic(actor): boolean {
        return this.game.setup.music && actor in this.game.setup.music
    }

    isSfx(actor): boolean {
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
