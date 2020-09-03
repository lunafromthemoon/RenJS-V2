interface ExecItem {
    c: number;
    total?: number;
    action?: string;
    scene?: any;
    index?: any;
    op?: any;
    interrupting?: any;
}
interface RJSControlInterface {
    execStack: ExecItem[];
    globalCounter: number;
    paused: boolean;
    fadetime: number;
    timeout: number;
    waitForClick: boolean;
    resolve?: () => Promise<any>;
    clickLocked: boolean;
    nextAction?: () => (void | Promise<any>);
    doBeforeResolve?: () => void;
    skipping: boolean;
    auto: boolean;
    clickCooldown: number;
    wholeAction: any;
    action?: any;
}
export default class RJSControl implements RJSControlInterface {
    defaultValues: any;
    constructor(defaultValues: object);
    auto: boolean;
    clickCooldown: any;
    clickLocked: boolean;
    execStack: ExecItem[];
    fadetime: any;
    globalCounter: number;
    paused: boolean;
    skipping: boolean;
    timeout: any;
    waitForClick: boolean;
    doBeforeResolve: any;
    nextAction: any;
    resolve: any;
    wholeAction: any;
    action: any;
}
export {};
