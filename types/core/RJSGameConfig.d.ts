import { IGameConfig } from 'phaser-ce';
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
    backgroundColor: number;
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
    fadetime: number;
    skiptime: number;
    autotime: number;
    timeout: number;
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
