import { Sprite } from 'phaser-ce';
import RJS from '../core/RJS';
import { RJSSpriteManagerInterface } from './RJSManager';

export default class BackgroundManager implements RJSSpriteManagerInterface {
    backgrounds: { [key: string]: string } = {};
    current?: Sprite;

    constructor(private game: RJS) {
        if (game.setup.backgrounds){
            this.backgrounds = game.setup.backgrounds
        }
    }

    createBackground(name: string): Sprite {
        const str = this.backgrounds[name].split(' ');
        const pos = this.game.storyConfig.positions.BACKGROUND ?
                this.game.storyConfig.positions.BACKGROUND :
                {x:this.game.world.centerX, y:this.game.world.centerY};
        const bg: Sprite = this.game.managers.story.backgroundSprites.create(pos.x,pos.y, name);
        bg.alpha = 0;
        bg.visible = false;
        bg.name = name;
        bg.anchor.set(0.5);
        if (str.length !== 1){
            const framerate = str.length === 4 ? parseInt(str[3], 10) : 16;
            bg.animations.add('run', null, framerate);
            bg.animations.play('run', null, true);
        }
        return bg
    }

    set (name: string): void {
        if (this.current){
            this.current.destroy();
        }
        if (!name){
            this.current = null;
            return;
        }
        this.current = this.createBackground(name);
        this.current.alpha = 1;
        this.current.visible = true;
    }

    async show (name: string, transitionName: string): Promise<void> {
        const oldBg = this.current;
        this.current = name ? this.createBackground(name) : null;
        if (this.current){
            this.current.visible=true;
        }
        await this.game.screenEffects.transition.get(transitionName)(oldBg,this.current);
        if (oldBg) oldBg.destroy();
    }

    async hide (bg?: string, transitionName = 'FADEOUT'): Promise<void> {
        if(this.current && (!bg || bg === this.current.name)) await this.show(null,transitionName);
    }

    isBackground (actor: string): boolean {
        return actor in this.backgrounds;
    }
}

