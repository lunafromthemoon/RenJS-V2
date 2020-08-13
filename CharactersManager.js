function Character(name,speechColour){
    
    this.name = name;
    // RenJS.characters[this.name] = this;
    this.looks = {};
    this.currentLook = null;
    this.speechColour = speechColour;
    this.lastScale = 1;

    this.addLook = function(lookName,image){        
        var look = RenJS.storyManager.characterSprites.create(config.positions.CENTER.x,config.positions.CENTER.y,(image ? image : lookName));
        look.anchor.set(0.5,1);
        look.alpha = 0;
        look.name = lookName;
        this.looks[lookName] = look;
        if (!this.currentLook){
            this.currentLook = this.looks[lookName];
        }
    }
}

function CharactersManager(){
    this.characters = {};
    this.showing = {};
    
    this.add = function(name,displayName,speechColour,looks){
        this.characters[name] = new Character(displayName,speechColour);
        _.each(looks,function(filename,look){
            this.characters[name].addLook(look,name+"_"+look);
        },this);
    }

    this.show = function(name,transition,props){        
        var ch = this.characters[name];
        var oldLook = ch.currentLook;
        ch.currentLook = props.look ? ch.looks[props.look] : ch.looks.normal;

        if (!props.position){
            props.position = (oldLook != null) ? {x:oldLook.x,y:oldLook.y} : config.positions.CENTER;
        }
        if (props.flipped != undefined){
            ch.lastScale = props.flipped ? -1 : 1;
        }
        this.showing[name] = {look: ch.currentLook.name,position:props.position,flipped:(ch.lastScale==-1)};
        return transition(oldLook,ch.currentLook,props.position,ch.lastScale,RenJS.storyManager.characterSprites);
    }

    this.hide = function(name,transition){
        var ch = this.characters[name];
        var oldLook = ch.currentLook;        
        ch.currentLook = null;
        delete this.showing[name];
        return transition(oldLook,null);
    }

    this.set = function (showing) {
        this.hideAll('CUT');
        this.showing = showing;
        _.each(this.showing,function(ch,name) {
            var character = this.characters[name];
            character.currentLook = character.looks[ch.look];
            character.currentLook.x = ch.position.x; 
            character.currentLook.y = ch.position.y;
            character.currentLook.scaleX = ch.flipped ? -1 : 1;
            character.currentLook.alpha = 1;
        },this);
    }

    this.hideAll = function(transition){
        if (!transition) transition = 'FADEOUT';
        return new Promise(function(resolve,reject){
            var promises = []
            var chars = _.keys(RenJS.chManager.showing)
            _.each(chars,function(char){
                promises.push(RenJS.chManager.hide(char,RenJS.transitions[transition]));
            },RenJS.chManager)
            Promise.all(promises).then(resolve);
        });
    }

    this.isCharacter = function(actor){
        return _.has(this.characters,actor);
    }

}

