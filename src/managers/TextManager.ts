import RJSManagerInterface from './RJSManager';
import RJS from '../RJS';

export interface TextManagerInterface extends RJSManagerInterface {}

export default class TextManager implements TextManagerInterface {

    private game: RJS

    constructor(game: RJS) {
        this.game = game
    }
    set(...args: any): void {
        //
    }

    async show (text, title?, colour?): Promise<void> {
        const t = this.game.managers.logic.parseVars(text.toString());
        this.game.gui.showText(t, title, colour, () => {
            this.game.waitForClick(() => {
                this.game.gui.hideText();
            });
        });
    };

    async hide (): Promise<void> {
        this.game.gui.hideText();
    }

    async say (name, look, text): Promise<void> {
        const character = this.game.managers.character.characters[name];
        if (look){
            this.game.managers.character.show(name, this.game.screenEffects.transition.CUT,{look});
        }
        return this.show(text,character.name,character.speechColour);
    }

}
