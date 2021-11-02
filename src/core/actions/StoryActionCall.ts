import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionCall extends StoryAction {

    actor: string

    constructor(protected game: RJS, public actionType: string, protected properties:{[key: string]:any}){
        super(game,actionType,properties)
        this.actor = this.parseActor();
    }

    execute(): void {
      const plugin = this.game.pluginsRJS[this.actor];
      plugin.onCall(this.properties);
      // custom action should know when it resolves
    }
}
