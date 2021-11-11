import StoryActionText from './StoryActionText';
import RJS from '../RJS';

export default class StoryActionSay extends StoryActionText {

    actor: string
    look: string

    constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
        super(game,actionType,properties)
        this.actor = this.keyParams[0];
        this.look = (this.keyParams.length > 2) ? this.keyParams[2] : null;
        if (this.game.managers.story.reservedWords.includes(this.look)){
            console.log('look is reserved word')
            this.look = null;
        }
    }

    execute(): void {
        let transitioning: Promise<any> = null;
        transitioning = this.game.managers.text.characterSays(this.actor, this.look, this.body,this.boxId, this.dontHide);
        this.resolve(transitioning);
    }
}