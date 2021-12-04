import RJS from '../core/RJS';
import {Group,Sprite} from 'phaser-ce';
import MaskSlider from './elements/MaskSlider'
import SaveSlot from './elements/SaveSlot'
import PushButton from './elements/PushButton'
import BaseButton from './elements/BaseButton'
import Label from './elements/Label'

export default class RJSMenu extends Group {
    id: string
    game: RJS
    elementFactory: {}
    saveSlots = {}
    // if element has id, index it for quick reference
    indexedElements: { [key: string]: any } = {}
    backgroundMusic: string = null;

    constructor(game: RJS, public config) {
        super(game);
        this.game = game;
        this.visible = false;
        this.id = config.id;

        this.elementFactory = {
            image: this.createImage.bind(this),
            button: this.createButton.bind(this),
            label: this.createLabel.bind(this),
            slider: this.createSlider.bind(this),
            saveSlot: this.createSaveSlot.bind(this)
        }
    }

    init(): void{
        for (const elementConfig of this.config){
            // create element with factory
            if (elementConfig.type === 'music'){
                this.backgroundMusic = elementConfig.asset;
                continue;
            }
            const element = this.elementFactory[elementConfig.type](elementConfig);
            // index element if it has an id
            if (elementConfig.id){
                this.indexedElements[elementConfig] = element;
            }
            // add display element to group (this)
            this.addChild(element);
        }
    }

    createImage(element: {x: number;y: number;asset: string}): Sprite {
        const spr: Sprite = this.game.add.sprite(element.x,element.y,element.asset,0);
        if (spr.animations.frameTotal){
            spr.animations.add('do').play()
        }
        return spr;
    }

    createLabel(element: {x: number;y: number;text: string;lineSpacing: number;style: any}): Label {
        return new Label(this.game, element)
    }

    createButton(element: {
        x: number;
        y: number;
        asset: string;
        sfx: string;
        binding: string;
        menu?: string;
        slot?: number;
        pushButton?: boolean;
        pushed?: boolean;
    }): BaseButton {
        let btn: BaseButton;
        if (element.pushButton){
            btn = new PushButton(this.game,element)
            if (element.binding === 'auto' || element.binding === 'skip'){
                // auto and skip will be unset when tapping anywhere in the screen
                // always index for changing state when this happens
                this.indexedElements[element.binding+'Button'] = btn;
            }
        } else {
            btn = new BaseButton(this.game,element);
        }
        this.game.accessibility.button({
            isActive: () => !this.game.control.unskippable && btn.parent === this.game.gui.menus[this.game.gui.currentMenu],
            label: [element.binding, element.menu, element.slot].filter(i => i).join(' '),
            onclick: () => btn.onClick(),
            onfocus: () => btn.frame = 1,
            onblur: () => btn.frame = 0,
            getBounds: () => {
                const r = btn.getBounds();
                r.x = btn.position.x;
                r.y = btn.position.y;
                return r;
            },
        });
        return btn;
    }

    createSlider(element: {
        x: number;
        y: number;
        asset: string;
        binding: string;
        userPreference?: string;
        sfx: string;
        mask?: string;
    }): MaskSlider {
        let value = 0.5;
        if (element.binding === 'changeUserPreference'){
            const preference = this.game.userPreferences.preferences[element.userPreference];
            value = (preference.value-preference.min)/(preference.max - preference.min);
        }
        const slider = new MaskSlider(this.game,element,value);
        this.game.accessibility.slider({
            isActive: () => !this.game.control.unskippable && slider.parent === this.game.gui.menus[this.game.gui.currentMenu],
            label: [element.binding, element.userPreference].filter(i => i).join(' '),
            min: 0,
            max: 1,
            step: 0.05,
            get: () => slider.currentValue,
            set: (value) => slider.setValue(value),
            getBounds: () => {
                const r = slider.getBounds();
                r.x = slider.position.x;
                r.y = slider.position.y;
                return r;
            },
        });
        return slider
    }

    createSaveSlot(element: {
        x: number;
        y: number;
        asset: string;
        slot: number;
        thumbnail: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    }): SaveSlot{
        const saveSlot = new SaveSlot(this.game,element)
        this.saveSlots[element.slot] = saveSlot;
        return saveSlot;
    }

    // add thumbnail to specific save slot
    addThumbnail(thumbnail: string, slot: number): void {
        if (this.saveSlots[slot]){
            this.saveSlots[slot].loadThumbnail(thumbnail)
        }
    }

    async show(): Promise<any> {
        if (this.visible) return;
        this.alpha = 0;
        this.visible = true;
        // menu transitions are unskippable
        this.game.control.unskippable = true;
        if (this.backgroundMusic){
            this.game.managers.audio.play(this.backgroundMusic,'bgm',true);
        }
        const transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        await transition(null, this);
        // unlock unskippable
        this.game.control.unskippable = false;
    }

    async hide(mute = true): Promise<any>{
        if (!this.visible) return;
        if (mute && this.backgroundMusic){
            this.game.managers.audio.stop('bgm');
        }
        this.game.control.unskippable = true;
        const transition = this.game.screenEffects.transition.get(this.game.storyConfig.transitions.menus);
        await transition(this, null);
        this.game.control.unskippable = false;
        this.visible = false;
    }

    destroy(): void {
    	this.destroy();
    }
}
