import StoryAction from './StoryAction';
import RJS from '../RJS';
export default class StoryActionEffect extends StoryAction {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    condition: string;
    branches: {
        ISTRUE: any;
        ISFALSE?: any;
    };
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    execute(): void;
}
