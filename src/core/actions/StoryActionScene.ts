import StoryAction from './StoryAction';
import RJS from '../RJS';

export default class StoryActionScene extends StoryAction {

    scene: string

    constructor(protected game: RJS, protected actionType: string, protected properties:{[key: string]:any}){
        super(game,actionType,properties)
        this.scene = this.game.managers.logic.parseVars(this.body)
    }

    execute(): void {
        this.resolve(this.game.managers.story.startScene(this.scene));        
    }
}