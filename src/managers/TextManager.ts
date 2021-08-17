import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
import Transition from '../screen-effects/Transition';

export interface TextManagerInterface extends RJSManagerInterface {}

export default class TextManager implements TextManagerInterface {

    private game: RJS
    textLog: Array<any> = []

    constructor(game: RJS) {
        this.game = game
    }
    set(...args: any): void {
        //
    }

    async display(text,boxId='default',dontHide=false) {
        text = this.game.managers.logic.parseVars(text.toString())
        await this.game.gui.hud.showText(boxId,text);
        if (this.game.storyConfig.logText){
            this.textLog.push({text,boxId});
        }
        return new Promise(resolve=>{
            this.game.waitForClick(() => {
                if (!dontHide){
                    this.game.gui.hud.hideText(boxId);
                }
                resolve(true);
            });
        })
    };

    async characterSays(keyName, look, text, boxId='default',dontHide=false){
        // find character
        const character = this.game.managers.character.characters[keyName];
        if (look){
            this.game.managers.character.show(keyName, this.game.storyConfig.transitions.say,{look});
        }
        this.game.gui.hud.showName(character.nameBox, character.name, character.speechColour);
        await this.display(text,boxId,dontHide);
        if (!dontHide){
            this.game.gui.hud.hideName(character.nameBox);
        }
    }

}
