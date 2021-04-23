import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
export interface TextManagerInterface extends RJSManagerInterface {
}
export default class TextManager implements TextManagerInterface {
    private game;
    textLog: Array<any>;
    constructor(game: RJS);
    set(...args: any): void;
    show(text: any, title?: any, colour?: any, dontHide?: any): Promise<any>;
    hide(): void;
    say(name: any, look: any, text: any, dontHide?: any): Promise<any>;
}
