import {DefaultsInterface} from './Defaults';

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

    constructor(defaultValues: DefaultsInterface) {
        this.clickCooldown = defaultValues.clickCooldown
        this.fadetime = defaultValues.fadetime
        this.timeout = defaultValues.timeout
    }

    auto = false;
    clickCooldown = 0
    clickLocked = false;
    execStack: ExecItem[] = [{c: -1}];
    fadetime = 0
    globalCounter = 0;
    paused = false;
    skipping = false;
    timeout = 0
    waitForClick = false;
    doBeforeResolve = null
    nextAction = null
    resolve = null
    wholeAction: any;
    action = null;
}
