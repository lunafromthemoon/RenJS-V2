import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionText extends StoryAction {

	// protected params: {actor:string, look: string, boxId?: string, body: string}
    protected boxId: string
    // this variable will be set to true by the logic manager to keep the text while showing the choices
    public dontHide: boolean = false

    constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
        super(game,actionType,properties)
        this.boxId = this.parseParameter('IN','string',true)
    }

    execute(): void {
        let transitioning: Promise<any> = null;
        // const boxId = this.boxId ? this.boxId : 'default'
		transitioning = this.game.managers.text.display(this.body,this.boxId, this.dontHide);
        this.resolve(transitioning);
    }
}

