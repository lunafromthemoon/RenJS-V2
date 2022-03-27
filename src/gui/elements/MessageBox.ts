import RJS from '../../core/RJS';
import {Sprite,Sound} from 'phaser-ce';
import {setTextStyles} from '../../utils/gui'
import Label from './Label'


export default class MessageBox extends Sprite{
    text: Label
    ctc?: Sprite
    portrait?: Sprite

    textLoop: number
    punctuationMarks: string[] = []
    punctuationWait = 5
    // sound effects
    defaultSfx?: Sound

    game: RJS

    config: {
        id: string;
        x: number;
        y: number;
        asset: string;
        sfx: string;
        transition?: string;
        text: {
            x: number;
            y: number;
            lineSpacing: number;
            style: any;
        };
        ctc: {
            x: number;
            y: number;
            asset: string;
            sfx: string;
            animationStyle?: string;
        };
        portrait?: {
            x: number;
            y: number;
        };
        alwaysOn: boolean;
    }

    constructor(game: RJS, config) {
        super(game,config.x,config.y,config.asset);
        this.config = config;
        if (!this.config.transition){
            this.config.transition = this.game.storyConfig.transitions.messageBox;
        }
        this.game = game;
        this.visible = false;
        // create sound effects
        if (this.config.sfx !== 'none' && this.game.cache.checkSoundKey(this.config.sfx)){
            this.defaultSfx = this.game.add.audio(this.config.sfx);
            // play and stop to load the sound for real, it's a phaser thing
            this.defaultSfx.play();
            this.defaultSfx.stop();
        }
        var bounds = null;
        if (this.config.text.style.align && this.config.text.style.align != "left"){
            // any alignment other than ltr needs to have bounds set
            this.config.text.style.boundsAlignV = "top";
            this.config.text.style.boundsAlignH = this.config.text.style.align;
            // height is not as important, as we'll set the text from the top anyway
            bounds = {width: this.config.text.style.wordWrapWidth, height: this.height}
        }
        this.text = new Label(this.game,this.config.text,bounds)
        this.addChild(this.text);
        // create ctc
        if (this.config.ctc){
            this.ctc = this.game.add.sprite(this.config.ctc.x,this.config.ctc.y,config.ctc.asset);
            if (this.config.ctc.animationStyle === 'spritesheet') {
                this.ctc.animations.add('do').play(12,true)
            } else if (this.config.ctc.animationStyle !== 'none') {
                this.ctc.alpha = 0;
                this.game.add.tween(this.ctc).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None,true,0,-1,true);
            }
            this.addChild(this.ctc)
        }
        // punctuation
        if (this.game.storyConfig.punctuationMarks){
            this.punctuationMarks = this.game.storyConfig.punctuationMarks;
        }
        if (this.game.storyConfig.punctuationWait){
            this.punctuationWait = this.game.storyConfig.punctuationWait
        }
        // if message box is always on, show it from the start
        if (this.config.alwaysOn){
            this.visible = true;
        }
    }

    onCharacter?: (characters: string,index: number) => void;

    destroy(): void {
        this.text.destroy();
    	if (this.ctc) this.ctc.destroy();
        if (this.defaultSfx) this.defaultSfx.destroy();
        if (this.portrait) this.portrait.destroy();
    	super.destroy();
    }

    animateText(sfx): Promise<any> {
        // animates the text by changing the alpha of each character 
        // from transparent to whatever color it should have
        const colors = [...this.text.colors];
        const finalText = this.text.text;
        const textSpeed: number = this.game.userPreferences.get('textSpeed');
        // make all characters transparent
        console.log(this.text.canvas.getContext('2d').textAlign)
        this.text.clearColors();
        console.log(this.text.canvas.getContext('2d').textAlign)
        this.text.addColor("#FF0000",0);
        this.text.visible = true;
        return new Promise(async resolve=>{

            let charIdx = 0;


            const completeText = (): void => {
                // text finished showing, clear timeout
                clearTimeout(this.textLoop);
                if (charIdx<finalText.length){
                    // text was skipped
                    // remove transparency
                    this.text.addColor(colors[charIdx],charIdx);
                    // add any color missing
                    for (var i=charIdx; i<colors.length; i++){
                        if (colors[i]){
                            this.text.addColor(colors[i],i)
                        }
                    }
                }
                
                // show ctc
                this.showCTC();                
                // finish promise
                resolve(true);
            }
            this.visible = true;
            const transition = this.game.screenEffects.transition.get(this.config.transition);
            await transition(null,this);

            // how many characters to add per sfx played
            let charPerSfx = this.game.storyConfig.charPerSfx ?  this.game.storyConfig.charPerSfx : 1;

            if (sfx && charPerSfx === 'auto'){
                charPerSfx = Math.ceil(sfx.durationMS/textSpeed);
            }
            // sfx will only play when sfxCharCount === 0, and will reset when sfxCharCount === charPerSfx
            let sfxCharCount = 0;

            if (sfx && charPerSfx === -1){
                // play only once and mute
                sfx.play();
                sfx.volume = this.game.userPreferences.get('sfxv');
                sfx = null;
            }
            // skip text animation on click
            if (!this.game.control.auto){
                this.game.waitForClick(completeText);
            }

            let waitingFor = 0;
            

            

            this.textLoop = window.setInterval(() => {
                if (waitingFor>0) {
                    // waiting after punctuation mark, don't do anything
                    waitingFor--;
                    return;
                }
                // add next character
                // reset colors
                if (charIdx < finalText.length){
                    // hide all chars after charIdx+1
                    this.text.addColor("#FF0000",charIdx+1);
                    // show current character by removing the transparent color
                    this.text.addColor(colors[charIdx],charIdx);
                }
                

                if (this.onCharacter){
                    this.onCharacter(finalText,charIdx);
                }
                // play sfx
                if (sfx){
                    if (finalText[charIdx] === ' ' || finalText[charIdx] === '\n'
                        || this.punctuationMarks.includes(finalText[charIdx])
                        || sfxCharCount === charPerSfx){
                        // reset count, but don't play
                        sfxCharCount=-1;
                    } else if (sfxCharCount === 0){
                        sfx.play();
                        sfx.volume = this.game.userPreferences.get('sfxv');
                    }
                    sfxCharCount++;
                }
                // if it's punctuation mark, add waiting time
                if (this.punctuationMarks.includes(finalText[charIdx])){
                    waitingFor = this.punctuationWait;
                }
                // increment character index and check if it finished
                charIdx++;
                if (charIdx >= finalText.length){
                    completeText();
                }
            }, textSpeed);
        })
    }

    // display message box with transition
    // show text character per character,
    // when whole text is displayed, show click to continue and wait for click
    // when player clicks, message box is hid with transition and action ends
    show(text,sfx?): Promise<any> {
        this.game.accessibility.text(text);
        if (sfx === 'none'){
            // if character voice configured as none, don't make any sound
            sfx = null;
        } else if (!sfx && this.defaultSfx){
            sfx = this.defaultSfx;
        }
        this.text.wordWrapWidth = this.config.text.style.wordWrapWidth;
        let finalText = setTextStyles(text,this.text);
        console.log(this.text.canvas.getContext('2d').textAlign)
        this.text.setText(finalText,true)
        console.log(this.text.canvas.getContext('2d').textAlign)
        this.text.visible = false;
        
        const textSpeed: number = this.game.userPreferences.get('textSpeed');
        if (this.game.control.skipping || textSpeed < 10){
            // this.text.clearColors();
            // this.text.addColor("#FF0000",0);
            this.text.visible = true;
            this.visible = true;
            this.alpha = 1;
            this.showCTC();
            return;
        } else {
            return this.animateText(sfx)
        }
    }

    showCTC(): void{
        if (this.ctc){
            this.ctc.visible = true;
            if (this.config.ctc.sfx){
                this.game.managers.audio.playSFX(this.config.ctc.sfx);
            }
            // animate ctc here
        }
    }

    async hide(transitionName?): Promise<any>{
        this.game.accessibility.text();
        if (!this.visible) return;
        if (!transitionName) transitionName = this.config.transition;
        const transition = this.game.screenEffects.transition.get(transitionName);
        await transition(this,null);
        this.visible = false;
    }

    async clear(transitionName?): Promise<any> {
        if(!this.config.alwaysOn){
            await this.hide(transitionName)
        }
        this.text.setText('', true);
        if (this.ctc){
            this.ctc.visible = false;
        }
        if (this.portrait){
            this.portrait.destroy();
            this.portrait = null;
        }
    }
}
