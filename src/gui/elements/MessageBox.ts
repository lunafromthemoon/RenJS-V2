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
        textAnimation?: string;
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
        this.text = new Label(this.game,this.config.text,this)
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

    onCharacter?: (characters: string[],index: number) => void;

    destroy(): void {
        this.text.destroy();
    	if (this.ctc) this.ctc.destroy();
        if (this.defaultSfx) this.defaultSfx.destroy();
        if (this.portrait) this.portrait.destroy();
    	super.destroy();
    }

    // display message box with transition
    // show text character per character,
    // when whole text is displayed, show click to continue and wait for click
    // when player clicks, message box is hid with transition and action ends
    async show(text: string,sfx?: string): Promise<any> {
        this.game.accessibility.text(text);
        this.text.wordWrapWidth = this.config.text.style.wordWrapWidth;
        // will set text styles and return any pauses
        const styles = setTextStyles(text,this.text,true);
        let finalText = styles[0];
        const pauses = styles[1];
        if (this.game.control.skipping || this.game.userPreferences.get('textSpeed') < 10){
            this.text.setText(finalText, true);
            this.visible = true;
            this.alpha = 1;
            if (this.ctc){
                this.ctc.visible = true;
            }
            return Promise.resolve(true);
        }
        this.text.setText('', true);

        // add new line characters at the end of each line
        if (this.game.storyConfig.precomputeBreakLines){

            const lines = this.text.precalculateWordWrap(finalText)
            // make it much wider so adding the breaklines wont change again the word wrapping
            this.text.wordWrapWidth = this.config.text.style.wordWrapWidth*2;
            finalText = '';
            for (const line of lines){
                finalText+=line.replace(/.$/,'\n');
            }
        }

        this.visible = true;
        const transition = this.game.screenEffects.transition.get(this.config.transition);
        await transition(null,this);
        if (pauses.length > 0) {
            let pauseStart = 0
            for(let i=0; i<pauses.length; i++){
                const textPart = finalText.substring(pauseStart, pauses[i].index)
                await this.showTextAnimation(this.text, textPart, sfx);
                pauseStart = pauses[i].index;
                await this.game.asyncWait(pauses[i].time)
            }
            const textPart = finalText.substring(pauseStart)
            await this.showTextAnimation(this.text, textPart, sfx)
        } else {
            await this.showTextAnimation(this.text, finalText, sfx)
        }
    }

    getCharacterSfx(sfx?): [Sound, number]{
        if (sfx === 'none'){
            // if character voice configured as none, don't make any sound
            sfx = null;
        } else if (!sfx && this.defaultSfx){
            sfx = this.defaultSfx;
        }

        // how many characters to add per sfx played
        let charPerSfx = this.game.storyConfig.charPerSfx ?  this.game.storyConfig.charPerSfx : 1;

        if (sfx && charPerSfx === 'auto'){
            charPerSfx = Math.ceil(sfx.durationMS/this.game.userPreferences.get('textSpeed'));
        }
        return [sfx, charPerSfx]
    }

    // Animate text appearing in the message box char per char
    // Returns promise that resolves when text is fully displayed
    async showTextAnimation(textObj: Phaser.Text, finalText: string, sfxConfig?): Promise<any>{

        // split in characters to add one by one
        const characters = finalText.split('');
        let [sfx, charPerSfx] = this.getCharacterSfx(sfxConfig)
        // sfx will only play when sfxCharCount === 0, and will reset when sfxCharCount === charPerSfx
        let sfxCharCount = 0;
        // punctuation waiting time
        let waitingFor = 0;
        // character index
        let charIdx = 0;
        const sfxVolume = this.game.userPreferences.get('sfxv');
        return new Promise(async resolve=>{
            const completeText = (): void => {
                // text finished showing, clear timeout
                clearTimeout(this.textLoop);
                // complete text in case of skipping
                const completeText = this.text.text + finalText.substring(charIdx)
                this.text.setText(completeText, true);

                // show ctc
                if (this.ctc){
                    this.ctc.visible = true;
                    if (this.config.ctc.sfx){
                        this.game.managers.audio.playSFX(this.config.ctc.sfx);
                    }
                }
                // text is fully displayed, finish promise
                resolve(true);
            }

            if (sfx && charPerSfx === -1){
                // play only once and mute
                sfx.play();
                sfx.volume = sfxVolume;
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
                this.text.text += (characters[charIdx]);

                // on Character handle
                if (this.onCharacter){
                    this.onCharacter(characters,charIdx);
                }
                // play sfx
                if (sfx){
                    if (characters[charIdx] === ' ' || characters[charIdx] === '\n'
                        || this.punctuationMarks.includes(characters[charIdx])
                        || sfxCharCount === charPerSfx){
                        // reset count, but don't play
                        sfxCharCount=-1;
                    } else if (sfxCharCount === 0){
                        sfx.play();
                        sfx.volume = sfxVolume;
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
            }, this.game.userPreferences.get('textSpeed'));
        })
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
        // this.text.setText('', true);
        if (this.ctc){
            this.ctc.visible = false;
        }
        if (this.portrait){
            this.portrait.destroy();
            this.portrait = null;
        }
    }
}
