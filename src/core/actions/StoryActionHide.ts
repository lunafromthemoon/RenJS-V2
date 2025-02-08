import StoryAction from './StoryAction';
import RJS from '@/core/RJS';
import {RJSSpriteManagerInterface} from '@/managers/RJSManager';

export default class StoryActionHide extends StoryAction {

    actor: string
    actorType: string
    transition: string
    contAfterTrans: boolean

    constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
    	super(game,actionType,properties)
        this.actor = this.parseActor();
        this.actorType = this.game.managers.story.getActorType(this.actor)
        this.transition = this.parseParameter('WITH','string')
        if (!this.transition) {
            this.transition = this.game.storyConfig.transitions.defaults[this.actorType];
        }
        this.contAfterTrans = this.parseParameter('CONTINUE')
    }

    execute(): void {
    	let transitioning: Promise<any> = null;
        if (this.actor === 'CHARS') {
            transitioning = this.game.managers.character.hideAll(this.transition)
        } else if (this.actor === 'CGS') {
            transitioning = this.game.managers.cgs.hideAll(this.transition)
        } else if (this.actor === 'ALL') {
            transitioning = Promise.all([
            	this.game.managers.background.hide(undefined, this.transition),
            	this.game.managers.character.hideAll(this.transition),
            	this.game.managers.cgs.hideAll(this.transition)
        	]);
        } else {
            const manager: RJSSpriteManagerInterface = this.game.managers.story.getManagerByActorType(this.actorType);
            transitioning = manager.hide(this.actor, this.transition);
        }
        this.resolve(transitioning,this.contAfterTrans);
    }
}
