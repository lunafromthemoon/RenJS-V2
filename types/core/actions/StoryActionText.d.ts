import StoryAction from './StoryAction';
export default class StoryActionText extends StoryAction {
    protected params: {
        actor: string;
        look: string;
        body: string;
    };
    constructor(params: any, game: any);
    execute(): void;
}
