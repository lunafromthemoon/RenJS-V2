import StoryAction from './StoryAction';
import RJS from '../RJS';
export default class StoryActionAnimate extends StoryAction {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    actor: string;
    contAfterTrans: boolean;
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    execute(): void;
}
