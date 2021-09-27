import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
export interface TextManagerInterface extends RJSManagerInterface {
}
export default class TextManager implements TextManagerInterface {
    private game;
    textLog: Array<any>;
    constructor(game: RJS);
    set(...args: any): void;
    display(text: any, boxId?: string, dontHide?: boolean): Promise<unknown>;
    characterSays(keyName: any, look: any, text: any, boxId: any, dontHide?: boolean): Promise<void>;
}
