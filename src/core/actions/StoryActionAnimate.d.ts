import StoryAction from './StoryAction';
export default class StoryActionAnimate extends StoryAction {
    protected params: {
        actor: string;
        transition: string;
        contAfterTrans: boolean;
        time: number;
    };
    constructor(params: any, game: any);
    execute(): void;
}
