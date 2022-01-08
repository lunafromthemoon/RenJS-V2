import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionText extends StoryAction {

	// protected params: {actor:string, look: string, boxId?: string, body: string}
    protected boxId: string
    // this variable will be set to true by the logic manager to keep the text while showing the choices
    public dontHide = false

    constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
        super(game,actionType,properties)
        this.boxId = this.parseParameter('IN','string',true)
    }

    execute(): void {
        let transitioning: Promise<any> = null;
        // const boxId = this.boxId ? this.boxId : 'default'
        if (this.game.storyConfig.keepStoryLog){
            // parse the variables of the message in this exact moment, since later they could change!
            const message = this.game.managers.logic.parseVars(this.body.toString())
            this.game.storyLog.push({message: message});
        }
		transitioning = this.game.managers.text.display(this.body,this.boxId, null, this.dontHide);
        this.resolve(transitioning);
    }
}

