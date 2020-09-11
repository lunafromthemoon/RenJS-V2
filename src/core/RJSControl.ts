import {DefaultsInterface} from './Defaults';
import ExecStack from './ExecStack'

interface RJSControlInterface {
    execStack: ExecStack;
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
    execStack = new ExecStack()
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
