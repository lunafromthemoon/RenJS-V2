import ExecStack from './ExecStack';
interface RJSControlInterface {
    paused: boolean;
    waitForClick: boolean;
    clickLocked: boolean;
    skipping: boolean;
    unskippable: boolean;
    auto: boolean;
    clickCooldown: number;
    execStack: ExecStack;
    actionsCounter: number;
    nextAction?: () => (void | Promise<any>);
}
export default class RJSControl implements RJSControlInterface {
    skipping: boolean;
    unskippable: boolean;
    auto: boolean;
    paused: boolean;
    clickCooldown: number;
    clickLocked: boolean;
    waitForClick: boolean;
    execStack: ExecStack;
    actionsCounter: number;
    nextAction: any;
}
export {};
