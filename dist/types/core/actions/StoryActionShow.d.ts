import StoryAction from './StoryAction';
import RJS from '../RJS';
export default class StoryActionShow extends StoryAction {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    actor: string;
    actorType: string;
    transition: string;
    contAfterTrans: boolean;
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    execute(): void;
}
