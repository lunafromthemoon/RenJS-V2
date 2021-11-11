import RJS from '../RJS';
export interface StoryActionInterface {
    resolve(transitioning: Promise<any>, cont: boolean): any;
    execute(): any;
}
export default class StoryAction implements StoryActionInterface {
    protected game: RJS;
    actionType: string;
    protected properties: {
        [key: string]: any;
    };
    dontHide?: boolean;
    protected key: string;
    protected body: any;
    protected params: string[];
    protected keyParams: string[];
    constructor(game: RJS, actionType: string, properties: {
        [key: string]: any;
    });
    resolve(transitioning?: Promise<any>, cont?: boolean): void;
    execute(): void;
    parseParams(keyParams: any): string[];
    parseActor(): string;
    parseParameter(reservedWord: string, argType?: string, inKeyParams?: boolean): any;
}
