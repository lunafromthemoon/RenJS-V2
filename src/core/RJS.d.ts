import 'pixi';
import 'p2';
import { Game, Graphics } from 'phaser-ce';
import RJSControl from './RJSControl';
import BackgroundManager from '../managers/BackgroundManager';
import CharacterManager from '../managers/CharacterManager';
import AudioManager from '../managers/AudioManager';
import CGSManager from '../managers/CGSManager';
import TextManager from '../managers/TextManager';
import TweenManager from '../managers/TweenManager';
import LogicManager from '../managers/LogicManager';
import StoryManager from '../managers/StoryManager';
import Ambient from '../screen-effects/Ambient';
import Effects from '../screen-effects/Effects';
import Transition from '../screen-effects/Transition';
import { RJSGUI } from '../gui/RJSGUI';
import { RJSGameConfig } from './RJSGameConfig';
export default class RJS extends Game {
    gameStarted: boolean;
    control: RJSControl;
    xShots: any[];
    blackOverlay: Graphics;
    setup: any;
    story: object;
    gui: RJSGUI;
    config: RJSGameConfig;
    defaultValues: {
        name: string;
        defaultTextStyle: {
            font: string;
            fill: string;
            align: string;
        };
        settings: {
            textSpeed: number;
            autoSpeed: number;
            bgmv: number;
            sfxv: number;
            muted: boolean;
        };
        limits: {
            textSpeed: number[];
            autoSpeed: number[];
            bgmv: number[];
            sfxv: number[];
        };
        positions: {
            LEFT: {
                x: number;
                y: number;
            };
            OUTLEFT: {
                x: number;
                y: number;
            };
            CENTER: {
                x: number;
                y: number;
            };
            RIGHT: {
                x: number;
                y: number;
            };
            OUTRIGHT: {
                x: number;
                y: number;
            };
        };
        fadetime: number;
        skiptime: number;
        timeout: number;
        clickCooldown: number;
        transitions: {
            ch: string;
            bg: string;
            cgs: string;
            bgm: string;
        };
    };
    managers: {
        background: BackgroundManager;
        character: CharacterManager;
        audio: AudioManager;
        cgs: CGSManager;
        text: TextManager;
        tween: TweenManager;
        logic: LogicManager;
        story: StoryManager;
    };
    screenEffects: {
        ambient: Ambient;
        effects: Effects;
        transition: Transition;
    };
    constructor(config: RJSGameConfig);
    launch(): void;
    pause(): void;
    takeXShot(): void;
    unpause(force?: any): void;
    setBlackOverlay(): void;
    removeBlackOverlay(): void;
    start(): void;
    skip(): void;
    auto(): void;
    save(slot?: any): void;
    getSlotThumbnail(slot: any): string;
    loadSlot(slot: any): Promise<void>;
    waitForClick(callback?: any): void;
    waitTimeout(time: any, callback?: any): void;
    waitForClickOrTimeout(time: any, callback: any): void;
    onTap(pointer: any, doubleTap?: any): void;
    initInput(): void;
    lockClick(): void;
    resolve(): void;
    onInterpretActions(): void;
    initScreenEffects(): void;
    initManagers(): void;
}
