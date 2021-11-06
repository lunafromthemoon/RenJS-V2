export default interface RJSManagerInterface {
    set(...args: any): any;
}
export interface RJSSpriteManagerInterface extends RJSManagerInterface {
    set(...args: any): any;
    show(name: any, transition: any, props: any): any;
    hide(name: any, transition: any): any;
}
