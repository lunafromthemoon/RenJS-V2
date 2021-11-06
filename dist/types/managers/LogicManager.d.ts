import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';
export interface LogicManagerInterface<T> extends RJSManagerInterface {
    choicesLog: object;
    vars: object;
    currentChoices: any[];
    visualChoices?: T;
}
export default class LogicManager implements LogicManagerInterface<Group> {
    private game;
    choicesLog: object;
    vars: object;
    currentChoices: any[];
    interrupting?: {
        origin: number;
        execId: string;
    };
    showingText: boolean;
    constructor(game: RJS);
    set(vars: any): void;
    setVar(name: any, value: any): void;
    updateChoiceLog(index: any): void;
    choiceInLog(index: any): any;
    evalExpression(expression: any): any;
    branch(expression: any, branches: any): void;
    parseVars(text: any, useQM?: any): string;
    parseChoice(index: any, choice: any): any;
    choose(index: any): Promise<void>;
    getExecStackId(): string;
    checkTextAction(firstChoice: any): Promise<boolean>;
    showChoices(boxId: any, choices: any): Promise<void>;
    interrupt(boxId: any, choices: any): any;
    clearChoices(): Promise<void>;
}
