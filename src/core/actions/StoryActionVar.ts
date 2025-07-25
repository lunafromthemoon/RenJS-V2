import StoryAction from './StoryAction';
import RJS from '@/core/RJS';

export default class StoryActionVar extends StoryAction {

	// protected params: {actor: string, body: string}
    actor: string

    constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
        super(game,actionType,properties)
        this.actor = this.parseActor();
    }

    execute(): void {
        this.game.managers.logic.setVar(this.actor,this.body);
        this.resolve()
    }
}