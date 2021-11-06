import StoryAction from './StoryAction';
import RJS from '../RJS';
export default class StoryActionEffect extends StoryAction {
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
