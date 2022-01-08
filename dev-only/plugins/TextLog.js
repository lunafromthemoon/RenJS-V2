
class TextLog extends RenJS.Plugin {

    log = null;
    
    text = null;
    maxLines = 11;

    pageUpBtn = null;
    pageDownBtn = null;

    currentPage = 0;
    finalPage = -1;
    pages = []

    onInit() {
        //create log object
        //create phaser group to hold all graphic elements
        this.log = this.game.add.group();
        this.log.visible = false;
        //create invisible graphics layer with input enabled so when the log is shown, nothing else in the gui "works"
        const bgLayer = this.game.add.graphics();
        this.log.addChild(bgLayer)
        bgLayer.beginFill(0xFFFFFF);
        bgLayer.drawRect(0, 0, this.game.width, this.game.height);
        bgLayer.endFill();
        bgLayer.alpha = 0;
        bgLayer.inputEnabled = true;

        //create log background centered in the screen            
        const bg = this.game.add.sprite(this.game.world.centerX,20,"logBg");
        bg.anchor.set(0.5,0);
        this.log.addChild(bg);

        //create return button, to close the log
        const btnY = 415;
        const returnbtn = this.game.add.button(this.game.world.centerX,btnY,"logReturnBtn",async () => {
            //hide log with fade (but faster)
            const fade = this.game.storyConfig.fadetime
            this.game.storyConfig.fadetime = 150;
            await this.game.screenEffects.transition.FADEOUT(this.log)
            this.game.storyConfig.fadetime = fade;

            this.log.visible = false;
            this.pages = [];
            this.finalPage = -1;
            this.currentPage = 0;
            this.game.unpause();
        },this,1,0,1,0,this.log);
        returnbtn.anchor.set(0.5);

        //create arrow buttons
        this.pageUpBtn = this.game.add.button(this.game.world.centerX+80,btnY,"arrowBtn",async () => {
            if (this.currentPage>0){
                this.setPage(this.currentPage-1);    
            }
            
        },this,1,0,1,0,this.log);
        this.pageUpBtn.anchor.set(0,0.5);
        this.pageDownBtn = this.game.add.button(this.game.world.centerX-80,btnY,"arrowBtn",async () => {
            if (this.finalPage==-1 || this.currentPage<this.finalPage){
                this.setPage(this.currentPage+1);    
            }
        },this,1,0,1,0,this.log);
        this.pageDownBtn.anchor.set(0,0.5);
        //flip arrow
        this.pageDownBtn.scale.x = -1;

        // create empty text object where the text will be displayed
        const style = {...this.game.gui.hud.mBoxes.default.config.text.style};        
        style.wordWrapWidth = 640;
        this.text = this.game.add.text(80, 50, "", style);
        this.log.addChild(this.text);
        //add new action for the text log button
        this.game.gui.bindingActions['showTextLog'] = async ()=>{
            this.game.world.bringToTop(this.log);
            this.game.pause();
            //update log text, so it will display the last messages first
            this.setPage(0);
            
            //show log with fade in (but faster!)
            this.log.alpha = 0;
            this.log.visible = true;
            const fade = this.game.storyConfig.fadetime
            this.game.storyConfig.fadetime = 150;
            await this.game.screenEffects.transition.FADEIN(this.log)
            this.game.storyConfig.fadetime = fade;
        }

    }

    setPage(page){
        this.currentPage = page;
        if (this.pages.length <= this.currentPage){
            if (this.currentPage == 0){
                this.buildPage(0);
            } else {
                this.buildPage(this.pages[this.currentPage-1].offset);
            }
        }
        //only show page down button if you're NOT on the last page
        this.pageDownBtn.visible = this.currentPage!=this.finalPage;
        //only show page up if you're NOT on the first page
        this.pageUpBtn.visible = this.currentPage!=0;
        //set page
        const message = this.game.gui.setTextStyles(this.pages[this.currentPage].message,this.text);
        this.text.text = message;
    }

    buildPage(offset){
        var lines = 0;
        let finalRawText = '';
        // build the log "page", with a max amount of lines
        for (var i = this.game.storyLog.length -1 - offset; i>=0; i--){
            const entry = this.game.storyLog[i];
            var message = entry.message;
            if (entry.choice){
                message = "    - "+message;
            }
            if (entry.actor){
                const name = this.game.managers.character.characters[entry.actor].config.displayName
                //we'll show the character name in white
                message = "(color:#ffffff)"+name +":(end) "+message;
            }
            //remove any style tag to calculate the wordwrap
            const finalMessage = this.game.gui.setTextStyles(message,this.text);
            const messageLines = this.text.precalculateWordWrap(finalMessage)
            if (messageLines.length + lines > this.maxLines){
                //stop adding lines
                break;
            }
            lines+=messageLines.length;
            // use the raw message text to build the final message, so it will keep the style tags
            finalRawText = message + '\n' + finalRawText;
        }
        // if the index got to the end of the story log, it's the last page
        if (i==-1){
            this.finalPage = this.currentPage;
            // when you get to the last page, complete the text with empty lines
            for (var j=0;j<this.maxLines-lines;j++){
                finalRawText = '\n' + finalRawText;
            }
        }

        this.pages.push({message: finalRawText, offset: this.game.storyLog.length-1 - i});

    }
}

RenJSGame.addPlugin('TextLog',TextLog)