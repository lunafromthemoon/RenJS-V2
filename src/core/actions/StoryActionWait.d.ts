import StoryAction from './StoryAction';
export default class StoryActionWait extends StoryAction {
    protected params: {
        wait: string;
    };
    constructor(params: any, game: any);
    execute(): void;
}
