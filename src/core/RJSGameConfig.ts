import {IGameConfig} from 'phaser-ce';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface i18nInterface {
    langs: string[];
    background: string;
    path: string;
    format: string;
    w: number;
    h: number;
    current?: string;
}

export interface RJSGameConfig extends IGameConfig {
    name: string;
    w: number;
    h: number;
    backgroundColor:number;
    loadingScreen: {
        background: string;
        loadingBar: {
            asset: string;
            position: {
                x: number;
                y: number;
            };
            direction: number;
            size: {
                w: number;
                h: number;
            };
            fullBar?: string;
        };
        fade: boolean;
    };
    // logChoices: boolean;
    fonts: string;
    guiConfig: string;
    storySetup: string;
    storyConfig: string;
    storyText: string[];
    i18n?: i18nInterface;
    debugMode: boolean;
}

export interface StoryConfig extends IGameConfig {
    positions: any;

    // miliseconds for fade transitions
    fadetime: number;
    skiptime: number;
    autotime: number;
    timeout: number;
    // wether the game keeps a log of the player choices for replay purposes
    logChoices: boolean;
    lazyloading: boolean;
    transitions: {
        defaults: {
            characters: string;
            backgrounds: string;
            cgs: string;
            music: string;
        };
        say: string;
        visualChoices: string;
        textChoices: string;
        menus: string;
        skippable: boolean;
    };
}