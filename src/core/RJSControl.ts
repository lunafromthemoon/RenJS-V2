import ExecStack from './ExecStack'

export interface RJSControlInterface {
    // game status controls
    paused: boolean;
    waitForClick: boolean;
    clickLocked: boolean;
    skipping: boolean;
    unskippable: boolean;
    auto: boolean;
    clickCooldown: number;
    // action stack control
    execStack: ExecStack;
    actionsCounter: number;
    nextAction?: () => (void | Promise<any>);
}

export class RJSControl implements RJSControlInterface {
    // game status controls
    skipping = false;
    unskippable = false;
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
}
export default RJSControl