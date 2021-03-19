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
    visualChoices: Group;
    showingText: boolean;
    constructor(game: RJS);
    set(vars: any): void;
    setVar(name: any, value: any): void;
    updateChoiceLog(execId: any, choiceText: any): void;
    evalExpression(expression: any): any;
    branch(expression: any, branches: any): void;
    parseVars(text: any, useQM?: any): string;
    evalChoice(choice: any): any;
    showVisualChoices(choices: any): void;
    createVisualChoice(image: any, position: any, index: any, key: any, execId: any): Phaser.Button;
    choose(index: any, choiceText: any, execId: any): void;
    getExecStackId(): string;
    checkTextAction(firstChoice: any): Promise<boolean>;
    showChoices(choices: any): Promise<void>;
    interrupt(steps: any, choices: any): any;
    updateInterruptions(): void;
    clearChoices(): any;
}
