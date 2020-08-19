import RJSManagerInterface from "./RJSManager";

export interface AudioManagerInterface extends RJSManagerInterface {
    play(key: string, type: string, looped: boolean, transition: string)
    stop (type: string, transition: string)
    playSFX (key: string)
}

export default class AudioManager implements AudioManagerInterface {
    // @todo to implement
    play (key,type,looped,transition) {

    }

    // @todo to implement
    stop(type: string, transition: string) {

    }

    // @todo to implement
    playSFX(key) {

    }
}
