import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
import RJSManagerInterface from './RJSManager';
declare type Choice = {
    index: any;
    actions: any[];
    available: boolean;
    choiceText: string;
    previouslyChosen: boolean;
    interrupt?: boolean;
    origin?: any;
};
export interface LogicManagerInterface<T> extends RJSManagerInterface {
    choicesLog: {
        [key: string]: any[];
    };
    vars: {
        [key: string]: any;
    };
    currentChoices: Choice[];
    visualChoices?: T;
}
export default class LogicManager implements LogicManagerInterface<Group> {
    private game;
    choicesLog: {
        [key: string]: any[];
    };
    vars: {
        [key: string]: any;
    };
    currentChoices: Choice[];
    interrupting?: {
        origin: number;
        execId: string;
    } | null;
    showingText: boolean;
    constructor(game: RJS);
    set(vars: {
        [key: string]: any;
    }): void;
    setVar(name: string, value: any): void;
    updateChoiceLog(index: number): void;
    choiceInLog(index: number): boolean;
    evalExpression(expression: string): boolean;
    branch(expression: string, branches: {
        ISTRUE: any;
        ISFALSE?: any;
    }): void;
    parseVars(text: string, useQM?: boolean): string;
    parseChoice(index: number, choice: {
        [key: string]: any;
    }): Choice;
    choose(index: number): Promise<void>;
    getExecStackId(): string;
    checkTextAction(firstChoice: any): Promise<boolean>;
    showChoices(boxId: string, choices: any[]): Promise<void>;
    interrupt(boxId: string, choices: any[]): void;
    clearChoices(): Promise<void>;
}
export {};
