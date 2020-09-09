import StoryAction from './StoryAction';
export default class StoryActionScene extends StoryAction {
    protected params: {
        scene: string;
    };
    constructor(params: any, game: any);
    execute(): void;
}
