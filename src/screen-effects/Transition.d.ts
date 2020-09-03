import RJSScreenEffectInterface from './RJSScreenEffect';
import { Group } from 'phaser-ce';
import RJS from '../core/RJS';
export default class Transition implements RJSScreenEffectInterface {
    static CUT: string;
    static FADE: string;
    static FADEOUT: string;
    static FADEIN: string;
    static FUSION: string;
    static MOVE: string;
    static FADETOCOLOUR: string;
    private game;
    private tweenManager;
    constructor(game: RJS);
    CUT(from: any, to: any, position: any, scaleX?: any): Promise<void>;
    FADE(from: any, to: any, position: any, scaleX?: any): Promise<void>;
    FADEOUT(from: any): Promise<void>;
    FADEIN(to: any, position: any, scaleX: any): Promise<void>;
    FUSION(from: any, to: any, position: any, scaleX: any, group: Group): Promise<void>;
    MOVE(from: any, to: any, position: any, scaleX: any): Promise<void>;
    FADETOCOLOUR(from: any, to: any, position: any, scaleX: any, colour: any): Promise<void>;
    FADETOBLACK(from: any, to: any, position: any): Promise<void>;
    FADETOWHITE(from: any, to: any, position: any): Promise<void>;
}
