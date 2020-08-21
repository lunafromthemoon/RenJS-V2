import RJSGame from './RJSGame';

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
}

export default class RJSControl implements RJSControlInterface {
    private game: RJSGame

    constructor(game: RJSGame) {
        this.game = game
    }

    auto = false;
    clickCooldown = this.game.defaultValues.clickCooldown;
    clickLocked = false;
    execStack: ExecItem[] = [{c: -1}];
    fadetime = this.game.defaultValues.fadetime;
    globalCounter = 0;
    paused = false;
    skipping = false;
    timeout = this.game.defaultValues.timeout;
    waitForClick = false;
    doBeforeResolve = null
    nextAction = null
    resolve = null
    wholeAction: any;
}
