import { Sprite } from 'phaser-ce';
import RJS from '@/core/RJS';
import { RJSSpriteManagerInterface } from '@/managers/RJSManager';

export default class BackgroundManager implements RJSSpriteManagerInterface {
    current?: Sprite;

    constructor(private game: RJS) {
    }

    createBackground(name: string): Sprite {
        const str = this.game.setup.backgrounds[name].split(' ');
        const pos = this.game.storyConfig.positions.BACKGROUND ?
                this.game.storyConfig.positions.BACKGROUND :
                {x:this.game.world.centerX, y:this.game.world.centerY};
        const bg: Sprite = this.game.managers.story.backgroundSprites.create(pos.x,pos.y, name);
        bg.updateTransform();
        bg.alpha = 0;
        bg.visible = false;
        bg.name = name;
        bg.anchor.set(0.5);
        if (str.length !== 1){
            const framerate = str.length === 4 ? parseInt(str[3], 10) : 16;
            bg.animations.add('run', undefined, framerate);
            bg.animations.play('run', undefined, true);
        }
        return bg
    }

    set (name: string): void {
        if (this.current){
            this.current.destroy();
        }
        if (!name){
            this.current = undefined;
            return;
        }
        this.current = this.createBackground(name);
        this.current.alpha = 1;
        this.current.visible = true;
    }

    async show (name: string | null, transitionName: string): Promise<void> {
        const oldBg = this.current;
        this.current = name ? this.createBackground(name) : undefined;
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
        return this.game.setup.backgrounds && actor in this.game.setup.backgrounds;
    }
}

