import RJS from '@/core/RJS';
import Character from '@/entities/Character'

export interface TextManagerInterface {}

export default class TextManager implements TextManagerInterface {

    private game: RJS

    constructor(game: RJS) {
        this.game = game
    }

    async display(text: string,boxId: string,sfx=null,dontHide=false): Promise<any> {
        if (!boxId) boxId = 'default'
        text = this.game.managers.logic.parseVars(text.toString())
        await this.game.gui.hud.showText(boxId,text,sfx);
        return new Promise(resolve=>{
            this.game.waitForClick(() => {
                if (!dontHide){
                    this.game.gui.hud.hideText(boxId);
                }
                resolve(true);
            });
        })
    }

    async characterSays(keyName: string, look: string, text: string, boxId: string,dontHide=false): Promise<any>{
        // get character configuration
        const character: Character = this.game.managers.character.characters[keyName];
        const chConfig: {
            nameBox: string;
            messageBox: string;
            displayName: string;
            color: string;
        } = character.config;
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
                // create the portrait and set it to the bessage box
                character.createPortrait(look,this.game.gui.hud.mBoxes[boxId]);
            }

        }
        // display text and wait for click
        await this.display(text,boxId,character.voice,dontHide);
        // hide namebox
        if (!dontHide){
            this.game.gui.hud.hideName(chConfig.nameBox);
        }
    }

}
