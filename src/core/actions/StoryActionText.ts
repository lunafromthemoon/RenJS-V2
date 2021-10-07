import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionText extends StoryAction {

	// protected params: {actor:string, look: string, boxId?: string, body: string}
    protected boxId:string

    constructor(protected game: RJS, protected actionType: string, protected properties:{[key: string]:any}){
        super(game,actionType,properties)
        this.boxId = this.parseParameter('IN','string',true)
    }

    execute(): void {
        let transitioning: Promise<any> = null;
		transitioning = this.game.managers.text.display(this.body,this.boxId);
        this.resolve(transitioning);
    }
}

