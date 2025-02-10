import StoryAction from './StoryAction';
import RJS from '../RJS';

export class StoryActionChoice extends StoryAction {

    isVisualChoice: boolean
    isInterrupt: boolean
    handlerId: string

    constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
        super(game,actionType,properties)
        this.isInterrupt = this.parseParameter('interrupt','boolean',true)
        this.isVisualChoice = this.parseParameter('visualchoice','boolean',true)
        this.handlerId = this.parseParameter('IN','string',true)
        if (!this.handlerId){
            this.handlerId = this.isVisualChoice ? 'visualChoices' : 'default'
        }
    // constructor(params, game, private isVisualChoice, private isInterrupt) {
    }

    async execute(): Promise<any> {
        if (this.isInterrupt && this.body === 'hide'){
            // interrupts remain in screen until interacted or hidden
            this.game.managers.logic.clearChoices();
            this.resolve()
            return;
        }
        // stop skipping in player choice
        this.game.control.skipping = false;
        this.game.input.enabled = true;
        if (this.game.managers.logic.interrupting){
            await this.game.managers.logic.clearChoices();
        }
        if (this.isInterrupt){
            this.game.managers.logic.interrupt(this.handlerId,[...this.body]);
        } else {
            this.game.managers.logic.showChoices(this.handlerId,[...this.body]);
        }
        // this action is resolved on its own
    }
}
export default StoryActionChoice