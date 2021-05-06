import StoryAction from './StoryAction';
export default class StoryActionAudio extends StoryAction {
    private action;
    protected params: {
        actor: string;
        looped: boolean;
        asBGS: boolean;
        transition: string;
        actorType: any;
        fromSeconds: number;
        force: boolean;
    };
    constructor(params: any, game: any, action: any);
    execute(): void;
}
