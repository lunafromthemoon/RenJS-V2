import { DefaultsInterface } from './Defaults';
import ExecStack from './ExecStack';
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
    constructor(defaultValues: DefaultsInterface);
    auto: boolean;
    clickCooldown: number;
    clickLocked: boolean;
    execStack: ExecStack;
    fadetime: number;
    globalCounter: number;
    paused: boolean;
    skipping: boolean;
    timeout: number;
    waitForClick: boolean;
    doBeforeResolve: any;
    nextAction: any;
    resolve: any;
    wholeAction: any;
    action: any;
}
export {};
