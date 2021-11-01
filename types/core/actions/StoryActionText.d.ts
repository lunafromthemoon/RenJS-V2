import StoryAction from './StoryAction';
export default class StoryActionText extends StoryAction {
    protected params: {
        actor: string;
        mainAction: string;
        look: string;
        boxId?: string;
        body: string;
    };
    constructor(params: any, game: any);
    execute(): void;
}
