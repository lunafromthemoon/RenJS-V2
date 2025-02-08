import StoryActionText from './StoryActionText';
import RJS from '@/core/RJS';

export default class StoryActionSay extends StoryActionText {

    actor: string
    look: string
    actorType = 'characters'

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
        if (this.game.storyConfig.keepStoryLog){
            // parse the variables of the message in this exact moment, since later they could change!
            const message = this.game.managers.logic.parseVars(this.body.toString())
            this.game.storyLog.push({actor:this.actor, message});
        }
        transitioning = this.game.managers.text.characterSays(this.actor, this.look, this.body,this.boxId, this.dontHide);
        this.resolve(transitioning);
    }
}