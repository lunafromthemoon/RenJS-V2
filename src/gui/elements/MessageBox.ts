import RJS from '../../core/RJS';
import {Sprite,Text,Sound} from 'phaser-ce';
import {setTextStyles} from '../../utils/gui'
import Label from './Label'


export default class MessageBox extends Sprite{
    text: Label
    ctc?: Sprite

    textLoop: number
    punctuationMarks: string[] = []
    punctuationWait: number = 5
    // sound effects
    defaultSfx?: Sound

    game: RJS

    config: {
        id: string,
        x: number,
        y: number,
        asset: string,
        sfx: string,
        transition?: string,
        text: {
            x: number,
            y: number,
            lineSpacing: number,
            style: any
        },
        ctc: {
            x: number,
            y: number,
            asset: string,
            sfx: string,
            animationStyle?: string,
        },
        alwaysOn: boolean
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
        if (this.config.sfx != 'none' && this.game.cache.checkSoundKey(this.config.sfx)){
            this.defaultSfx = this.game.add.audio(this.config.sfx);
            // play and stop to load the sound for real, it's a phaser thing
            this.defaultSfx.play();
            this.defaultSfx.stop();
        }
        this.text = new Label(this.game,this.config.text,this)
        this.addChild(this.text);
        // create ctc
        if (this.config.ctc){
            this.ctc = this.game.add.sprite(this.config.ctc.x,this.config.ctc.y,config.ctc.asset);
            if (this.config.ctc.animationStyle === 'spritesheet') {
                this.ctc.animations.add('do').play()
            } else if (this.config.ctc.animationStyle == 'tween') {
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
    }

    onCharacter?: (characters:string[],index:number) => void;

    destroy(): void {
        this.text.destroy();
    	if (this.ctc) this.ctc.destroy();
        if (this.defaultSfx) this.defaultSfx.destroy();
    	super.destroy();
    }

    // display message box with transition
    // show text character per character, 
    // when whole text is displayed, show click to continue and wait for click
    // when player clicks, message box is hid with transition and action ends
    show(text,sfx?): Promise<any> {
        if (sfx=='none'){
            // if character voice configured as none, don't make any sound
            sfx=null;
        } else if (!sfx && this.defaultSfx){
            sfx = this.defaultSfx;
        }
        this.text.wordWrapWidth = this.config.text.style.wordWrapWidth;
        let finalText = setTextStyles(text,this.text);
        let textSpeed:number = this.game.userPreferences.get('textSpeed');
        if (this.game.control.skipping || textSpeed < 10){
            this.text.text = finalText;
            this.visible = true;
            this.alpha = 1;
            if (this.ctc){
                this.ctc.visible = true;
            }
            return;
        }
        this.text.text = '';
        
        // add new line characters at the end of each line
        if (this.game.storyConfig.precomputeBreakLines){
            
            const lines = this.text.precalculateWordWrap(finalText)
            // make it much wider so adding the breaklines wont change again the word wrapping
            this.text.wordWrapWidth = this.config.text.style.wordWrapWidth*2;
            finalText = '';
            for (const line of lines){
                finalText+=line.replace(/.$/,"\n");
            }
        }
        
        // split in characters to add one by one
        const characters = finalText.split('');
        let charIdx = 0;
        // punctuation waiting time
        let waitingFor = 0;
        // how many characters to add per sfx played
        let charPerSfx = this.game.storyConfig.charPerSfx ?  this.game.storyConfig.charPerSfx : 1;
        
        if (sfx && charPerSfx=='auto'){
            charPerSfx = Math.ceil(sfx.durationMS/textSpeed);
        }
        // sfx will only play when sfxCharCount == 0, and will reset when sfxCharCount == charPerSfx
        let sfxCharCount = 0;
        return new Promise(async resolve=>{
            const completeText = () => {
                // text finished showing, clear timeout
                clearTimeout(this.textLoop);
                // complete text in case of skipping
                this.text.text = finalText;
                // show ctc
                if (this.ctc){
                    this.ctc.visible = true;
                    if (this.config.ctc.sfx){
                        this.game.managers.audio.playSFX(this.config.ctc.sfx);
                    }
                }
                // finish promise
                resolve(true);
            }


            this.visible = true;
            let transition = this.game.screenEffects.transition.get(this.config.transition);
            await transition(null,this);

            if (sfx && charPerSfx==-1){
                // play only once and mute
                sfx.play();
                sfx.volume = this.game.userPreferences.get('sfxv');
                sfx = null;
            }
            // skip text animation on click
            if (!this.game.control.auto){
                this.game.waitForClick(completeText);
            }


            this.textLoop = window.setInterval(() => {
                if (waitingFor>0) {
                    // waiting after punctuation mark, don't do anything
                    waitingFor--;
                    return;
                }
                // add next character
                // if (characters[charIdx]!="\n"){
                    this.text.text += (characters[charIdx]);
                // } else {
                    // this.text.text += " "+(characters[charIdx]);
                // }
                
                if (this.onCharacter){
                    this.onCharacter(characters,charIdx);
                }
                // play sfx
                if (sfx){
                    if (characters[charIdx] == " " || this.punctuationMarks.includes(characters[charIdx]) || sfxCharCount==charPerSfx){
                        // reset count, but don't play
                        sfxCharCount=-1;
                    } else if (sfxCharCount==0){
                        sfx.play();
                        sfx.volume = this.game.userPreferences.get('sfxv');
                    }
                    sfxCharCount++;
                }
                // if it's punctuation mark, add waiting time
                if (this.punctuationMarks.includes(characters[charIdx])){
                    waitingFor = this.punctuationWait;
                }
                // increment character index and check if it finished
                charIdx++;
                if (charIdx >= characters.length){
                    completeText();
                }
            }, textSpeed);
        })
    }

    async hide(transitionName?){
        if (!this.visible) return;
        if (!transitionName) transitionName = this.config.transition;
        let transition = this.game.screenEffects.transition.get(transitionName);
        await transition(this,null);
        this.visible = false;
    }

    async clear(transitionName?) {
        if(!this.config.alwaysOn){
            await this.hide(transitionName)
        }
        this.text.text = '';
        if (this.ctc){
            this.ctc.visible = false;
        }
    }
}
