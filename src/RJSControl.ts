import RJS from './RJS';

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

    defaultValues: any

    constructor(defaultValues: object) {
        this.defaultValues = defaultValues
    }

    auto = false;
    clickCooldown = this.defaultValues.clickCooldown;
    clickLocked = false;
    execStack: ExecItem[] = [{c: -1}];
    fadetime = this.defaultValues.fadetime;
    globalCounter = 0;
    paused = false;
    skipping = false;
    timeout = this.defaultValues.timeout;
    waitForClick = false;
    doBeforeResolve = null
    nextAction = null
    resolve = null
    wholeAction: any;
    action = null;
}
