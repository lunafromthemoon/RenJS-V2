import {defaults} from './Defaults';

interface RJSControlInterface {
    execStack: object[],
    globalCounter: number,
    paused: boolean,
    fadetime : number,
    timeout : number,
    waitForClick : boolean,
    resolve?: () => Promise<any>,
    clickLocked: boolean,
    nextAction?: () => (void | Promise<any>)
    doBeforeResolve?: () => void,
    skipping: boolean,
    auto: boolean,
    clickCooldown: number,
}

export default class RJSControl implements RJSControlInterface {
    auto = false;
    clickCooldown = defaults.clickCooldown;
    clickLocked = false;
    execStack = [{c:-1}];
    fadetime = defaults.fadetime;
    globalCounter = 0;
    paused = false;
    skipping = false;
    timeout = defaults.timeout;
    waitForClick = false;
    doBeforeResolve = null
    nextAction = null
    resolve = null
}
