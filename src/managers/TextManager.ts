import RJSManagerInterface from './RJSManager';
import RJS from '../core/RJS';
import Transition from '../screen-effects/Transition';

export interface TextManagerInterface extends RJSManagerInterface {}

export default class TextManager implements TextManagerInterface {

    private game: RJS
    textLog: any[] = []

    constructor(game: RJS) {
        this.game = game
    }
    set(...args: any): void {
        //
    }

    async display(text,boxId,dontHide=false) {
        if (!boxId) boxId = 'default'
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

    async characterSays(keyName, look, text, boxId,dontHide=false){
        // get character configuration
        const character = this.game.managers.character.characters[keyName];
        const chConfig = character.config;
        // change look or show portrait

        // show name in namebox
        this.game.gui.hud.showName(chConfig.nameBox,chConfig.displayName,chConfig.color);
        // if not specified in action, use character defined message box (or 'default')
        if (!boxId){
            boxId = chConfig.messageBox
        }
        if (look){
            if (!character.usePortraits){
                // usual behaviour, just change the character look
                this.game.managers.character.show(keyName, this.game.storyConfig.transitions.say,{look});    
            } else {
                // obtain the message box
                const messageBox = this.game.gui.hud.mBoxes[boxId];
                character.createPortrait(look,messageBox);
            }
            
        }
        // display text and wait for click
        await this.display(text,boxId,dontHide);
        // hide namebox
        if (!dontHide){
            this.game.gui.hud.hideName(chConfig.nameBox);
        }
    }

}
