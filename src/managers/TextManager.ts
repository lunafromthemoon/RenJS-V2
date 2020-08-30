import RJSManagerInterface from './RJSManager';
import RJS from '../RJS';

export type TextManagerInterface = RJSManagerInterface

export default class TextManager implements TextManagerInterface {

    game: RJS

    constructor(game: RJS) {
        this.game = game
    }
    set(...args: any): void {
        //
    }

    async show (text, title?, colour?): Promise<void> {
        const t = this.game.RJS.managers.logic.parseVars(text.toString());
        this.game.RJS.gui.showText(t, title, colour, () => {
            this.game.RJS.waitForClick(() => {
                this.game.RJS.gui.hideText();
            });
        });
    };

    async hide (): Promise<void> {
        this.game.RJS.gui.hideText();
    }

    async say (name, look, text): Promise<void> {
        const character = this.game.RJS.managers.character.characters[name];
        if (look){
            this.game.RJS.managers.character.show(name, this.game.RJS.screenEffects.transition.CUT,{look});
        }
        return this.show(text,character.name,character.speechColour);
    }

}
