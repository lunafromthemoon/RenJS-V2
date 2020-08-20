import RJSManagerInterface from './RJSManager';

export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type: string, looped: boolean, transition: string): void;
    stop (type: string, transition: string): void;
    playSFX (key: string): void;
}

export default class AudioManager implements AudioManagerInterface {
    // @todo to implement
    play (key,type,looped,transition): void {
        //
    }

    // @todo to implement
    stop(type: string, transition: string): void {
        //
    }

    // @todo to implement
    playSFX(key): void {
        //
    }

    set (current): void {
        if (current.bgm){
            this.play(current.bgm,'bgm',true,'FADE');
        }
        if (current.bgs){
            this.play(current.bgs,'bgs',true,'FADE');
        }

    }
}
