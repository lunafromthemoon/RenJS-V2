import StoryAction from './StoryAction';
import RJS from '../RJS';
import {RJSSpriteManagerInterface} from '../../managers/RJSManager';

export default class StoryActionShow extends StoryAction {

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
        // parse continue after transition
        this.contAfterTrans = this.parseParameter('CONTINUE')
        // parse position with AT
        const position = this.parseParameter('AT','coords')
        if (position) {
            this.properties.position = position;
        }
        // parse flipped with FLIP
        const flip = this.parseParameter('FLIP');
        if (flip) {
            this.properties.flipped = 'flip';
        }
        // parse layer with BEHIND if cgs or with IN more generally
        if (this.actorType == 'cgs'){
            this.properties.layer = this.parseParameter('BEHIND') ? 'behindCharactersSprites' : 'cgsSprites'
        }
        const layer = this.parseParameter('IN','string');
        if (layer){
            this.properties.layer = layer;
        }
        // parse look if its a character
        if (this.actorType == 'characters'){
            this.properties.look = this.params[0];
            if (this.game.managers.story.reservedWords.includes(this.properties.look)){
                this.properties.look = null;
            }
            if (!this.properties.look){
                // default look
                this.properties.look = 'normal';
            }
        }


    }

    execute(): void {
        const manager: RJSSpriteManagerInterface = this.game.managers.story.getManagerByActorType(this.actorType);
    	const transitioning: Promise<any> = manager.show(this.actor, this.transition, this.properties);
        this.resolve(transitioning,this.contAfterTrans);
    }
}
