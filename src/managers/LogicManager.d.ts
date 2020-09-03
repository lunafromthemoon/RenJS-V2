import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';
export interface LogicManagerInterface<T> extends RJSManagerInterface {
    choicesLog: object;
    vars: object;
    currentChoices: any[];
    interrupting: boolean;
    visualChoices?: T;
}
export default class LogicManager implements LogicManagerInterface<Group> {
    choicesLog: object;
    vars: object;
    currentChoices: any[];
    interrupting: boolean;
    visualChoices: Group;
    private game;
    constructor(game: RJS);
    set(vars: any): void;
    setVar(name: any, value: any): void;
    evalExpression(expression: any): any;
    branch(expression: any, branches: any): void;
    parseVars(text: any, useQM?: any): string;
    evalChoice(choice: any): any;
    showVisualChoices(choices: any): void;
    createVisualChoice(image: any, position: any, index: any, key: any, execId: any): void;
    choose(index: any, chosenOption: any, execId: any): void;
    getExecStackId(): string;
    showChoices(choices: any): void;
    interrupt(steps: any, choices: any): any;
    clearChoices(): any;
}
