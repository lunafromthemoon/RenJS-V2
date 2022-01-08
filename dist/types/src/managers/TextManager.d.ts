import RJS from '../core/RJS';
export interface TextManagerInterface {
}
export default class TextManager implements TextManagerInterface {
    private game;
    constructor(game: RJS);
    display(text: string, boxId: string, sfx?: any, dontHide?: boolean): Promise<any>;
    characterSays(keyName: string, look: string, text: string, boxId: string, dontHide?: boolean): Promise<any>;
}
