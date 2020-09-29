import StoryAction from './StoryAction';
export default class StoryActionAudio extends StoryAction {
    private action;
    protected params: {
        actor: string;
        looped: boolean;
        transition: string;
        actorType: any;
    };
    constructor(params: any, game: any, action: any);
    execute(): void;
}