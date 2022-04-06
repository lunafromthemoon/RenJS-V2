export default interface RJSManagerInterface {
    set(...args: any): any;
}
export interface RJSSpriteManagerInterface extends RJSManagerInterface {
    set(...args: any): any;
    show(name: string, transitionName: string, props: any): any;
    hide(name: string, transitionName: string): any;
}
