import { Sprite, Group } from 'phaser-ce';
import RJS from '../../core/RJS';
export default class RJSLoadingScreen {
    private game;
    container: Group;
    loadingBar: Sprite;
    loadingBarBg: Sprite;
    background: Sprite;
    loadingDir: number;
    constructor(game: RJS);
    setLoadingBar(game: RJS): void;
    waitingScreen(): void;
    destroy(game: RJS): void;
}
