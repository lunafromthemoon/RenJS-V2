import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionEffect extends StoryAction {

    actor: string
    contAfterTrans: boolean

    constructor(protected game: RJS, public actionType: string, protected properties:{[key: string]:any}){
        super(game,actionType,properties)
        this.actor = this.parseActor();
        this.contAfterTrans = this.parseParameter('CONTINUE')
    }

    execute(): void {
    	if (this.game.screenEffects.effects[this.actor]){
    		let transitioning: Promise<any> = this.game.screenEffects.effects[this.actor](this.properties);
            this.resolve(transitioning,this.contAfterTrans);
    	} else if (this.game.pluginsRJS[this.actor]){
            // deprecate this
    		this.game.pluginsRJS[this.actor].onCall(this.params);
            // plugins resolve themselves
    	} else {
            this.resolve();
        }

    }
}