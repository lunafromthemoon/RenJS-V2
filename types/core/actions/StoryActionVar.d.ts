import StoryAction from './StoryAction';
export default class StoryActionVar extends StoryAction {
    protected params: {
        actor: string;
        body: string;
    };
    constructor(params: any, game: any);
    execute(): void;
}
