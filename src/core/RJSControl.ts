import ExecStack from './ExecStack'

interface RJSControlInterface {
    // game status controls
    paused: boolean;
    waitForClick: boolean;
    clickLocked: boolean;
    skipping: boolean;
    auto: boolean;
    clickCooldown: number;
    // action stack control
    execStack: ExecStack;
    actionsCounter: number;
    nextAction?: () => (void | Promise<any>);
    // wholeAction: any;
    // action?: any;

    // resolve?: () => Promise<any>;
    
    // doBeforeResolve?: () => void;
}

export default class RJSControl implements RJSControlInterface {

    constructor() {
        // this.clickCooldown = defaultValues.clickCooldown
        // this.fadetime = defaultValues.fadetime
        // this.timeout = defaultValues.timeout
    }
    // game status controls
    skipping = false;
    auto = false;
    paused = false;
    // click controls
    clickCooldown = 200;
    clickLocked = false;
    waitForClick = false;
    // story controls
    execStack = new ExecStack()
    actionsCounter = 0;
    nextAction = null

    // doBeforeResolve = null
    
    // resolve = null

    // wholeAction: any;
    // action = null;
}
