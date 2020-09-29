import StoryAction from './StoryAction';
export default class StoryActionEffect extends StoryAction {
    protected params: {
        actor: string;
        contAfterTrans: boolean;
    };
    constructor(params: any, game: any);
    execute(): void;
}
