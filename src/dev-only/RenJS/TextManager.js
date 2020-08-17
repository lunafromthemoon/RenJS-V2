function TextManager(){

    this.show = function(text,title,colour){
        return new Promise(function(resolve, reject) {
            var t = RenJS.logicManager.parseVars(text);
            RenJS.gui.showText(t,title,colour,function(){
                console.log("Waiting for click")
                RenJS.waitForClick(function(){
                    RenJS.gui.hideText();
                    resolve();
                });
            });
        }.bind(this));
    };

    this.hide = function(){
        RenJS.gui.hideText();
        RenJS.resolve();
    }

    this.say = function(name,look,text){
        var character = RenJS.chManager.characters[name];
        if (look){
            RenJS.chManager.show(name,RenJS.transitions.CUT,{look:look});
        }
        return this.show(text,character.name,character.speechColour);
    }
}

