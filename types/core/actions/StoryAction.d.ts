import RJS from '../RJS';
export interface StoryActionInterface {
    resolve(transitioning: Promise<any>, cont: boolean): any;
    execute(): any;
}
export default class StoryAction implements StoryActionInterface {
    protected game: RJS;
    protected params: object;
    constructor(params: any, game: any);
    resolve(transitioning?: Promise<any>, cont?: boolean): void;
    execute(): void;
}
