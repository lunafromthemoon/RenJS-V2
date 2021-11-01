import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionAmbient extends StoryAction {

	actor: string

    constructor(protected game: RJS, public actionType: string, protected properties:{[key: string]:any}){
        super(game,actionType,properties)
        this.actor = this.parseActor();
    }

    execute(): void {
    	this.game.screenEffects.ambient.start(this.actor);
        this.resolve();
    }
}