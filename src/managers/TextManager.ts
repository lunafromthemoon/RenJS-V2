import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
import Transition from '../screen-effects/Transition';

export interface TextManagerInterface extends RJSManagerInterface {}

export default class TextManager implements TextManagerInterface {

    private game: RJS

    constructor(game: RJS) {
        this.game = game
    }
    set(...args: any): void {
        //
    }

    show (text, title?, colour?): void {
        const t = this.game.managers.logic.parseVars(text.toString());
        this.game.gui.showText(t, title, colour, () => {
            this.game.waitForClick(() => {
                this.game.gui.hideText();
                this.game.resolveAction();
            });
        });
    };

    hide (): void {
        this.game.gui.hideText();
    }

    say (name, look, text): void {
        const character = this.game.managers.character.characters[name];
        if (look){
            this.game.managers.character.show(name, this.game.storyConfig.transitions.say,{look});
        }
        this.show(text,character.name,character.speechColour);
    }

}
