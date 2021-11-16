export default interface RJSManagerInterface {
    set(...args: any);
}

export interface RJSSpriteManagerInterface extends RJSManagerInterface {
    set(...args: any);
    show (name, transition, props): any;
    hide (name,transition): any;
}
