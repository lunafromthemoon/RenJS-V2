import StoryAction from './StoryAction';
export default class StoryActionText extends StoryAction {
    private isVisualChoice;
    private isInterrupt;
    protected params: {
        body: [];
        actor: string;
    };
    constructor(params: any, game: any, isVisualChoice: any, isInterrupt: any);
    execute(): void;
}
