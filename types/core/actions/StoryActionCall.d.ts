import StoryAction from './StoryAction';
export default class StoryActionCall extends StoryAction {
    protected params: {
        actor: string;
    };
    constructor(params: any, game: any);
    execute(): void;
}
