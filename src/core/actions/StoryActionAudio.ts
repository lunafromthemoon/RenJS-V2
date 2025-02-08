import StoryAction from './StoryAction';
import RJS from '@/core/RJS';

export default class StoryActionAudio extends StoryAction {

    actor: string
    actorType: string
    transition: string

    looped: boolean
    fromSeconds: number
    force: boolean
    channel: string

    constructor(protected game: RJS, public actionType: string, protected properties: {[key: string]: any}){
        super(game,actionType,properties)
        this.actor = this.keyParams[1]
        this.actorType = this.game.managers.story.getActorType(this.actor)
        this.transition = this.parseParameter('WITH','string')
        if (this.actionType === 'play'){
            // we don't care for these params when stopping
            this.looped = this.parseParameter('LOOPED')
            if (this.looped){
                this.fromSeconds = this.parseParameter('FROM','number')
            }
            this.force = this.parseParameter('FORCE')
            this.channel = this.parseParameter('IN','string')
            if (this.parseParameter('BGS')){
                // deprecated
                this.channel = 'bgs'
            }
            if (!this.channel){
                this.channel = 'bgm'
            }
        } else {
            this.channel = this.actor
        }
    }

    execute(): void {
        if (this.actionType === 'play'){
            if (this.actorType === 'music') {
                this.game.managers.audio.play(this.actor, this.channel, this.looped, this.fromSeconds, this.transition, this.force);
            } else {
                this.game.managers.audio.playSFX(this.actor);
            }
        } else {
            this.game.managers.audio.stop(this.channel, this.transition);
        }
        this.resolve()
    }
}