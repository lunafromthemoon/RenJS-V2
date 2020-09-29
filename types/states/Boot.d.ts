import RJSState from './RJSState';
declare class Boot extends RJSState {
    constructor();
    init(): void;
    preload(): void;
    create(): void;
}
export default Boot;
