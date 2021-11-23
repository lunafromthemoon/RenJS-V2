interface ExecItem {
    c: number;
    total?: number;
    scope?: string;
    index?: number;
    origin?: number;
}
export default class ExecStack {
    private execStack;
    constructor(stack?: [{
        c: number;
        total: number;
        scope: string;
        index: number;
    }]);
    shallowCopy(): any[];
    hash(): string;
    top(): ExecItem;
    bottom(): ExecItem;
    clear(): void;
    replace(scope: string): void;
    stack(scope: any, total: any, index?: number, origin?: number): void;
    advance(): void;
    getActions(story: any): any[];
}
export {};
