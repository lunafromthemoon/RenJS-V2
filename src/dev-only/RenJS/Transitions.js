RenJS.transitions = {
    CUT: function(from,to,position,scaleX){
        return new Promise(function(resolve, reject) {
            if (from){
                from.alpha = 0;
            }
            if (to) {
                to.alpha = 1;
                setNewProperties(to,position,scaleX);
            }
            resolve();
        });
    },
    FADE: function(from,to,position,scaleX){
        if (!from) return RenJS.transitions.FADEIN(to,position,scaleX);
        if (!to) return RenJS.transitions.FADEOUT(from);
        return new Promise(function(resolve, reject) {
            RenJS.tweenManager.chain([
                {sprite:from,tweenables:{alpha:0},callback:function(){
                    setNewProperties(to,position,scaleX);
                }},
                {sprite:to,tweenables:{alpha:1},callback:resolve}
            ],config.fadetime);
        });
    },
    FADEOUT: function(from){
        return new Promise(function(resolve, reject) {
            RenJS.tweenManager.tween(from,{ alpha: 0 },resolve,config.fadetime,true);
        });
    },
    FADEIN: function(to,position,scaleX){
        return new Promise(function(resolve, reject) {
            setNewProperties(to,position,scaleX);
            RenJS.tweenManager.tween(to,{ alpha: 1 },resolve,config.fadetime,true);     
        });   
    },
    FUSION: function(from,to,position,scaleX,group){
        if (!from || !to){
            return RenJS.transitions.FADE(from,to,position);
        }   
        return new Promise(function(resolve, reject) {
            if (group) {
                group.bringToTop(to);
            }
            setNewProperties(to,position,scaleX);
            RenJS.tweenManager.tween(to,{ alpha: 1 },function(){
                from.alpha = 0;
                resolve();
            },config.fadetime,true);
        });
    },
    MOVE: function(from,to,position,scaleX){
        if (!from || !to){
            return RenJS.transitions.CUT(from,to,position);
        } 
        return new Promise(function(resolve, reject) {
            RenJS.tweenManager.tween(from,{ x:position.x,y:position.y },function(){
                setNewProperties(to,position,scaleX);
                from.alpha = 0;
                to.alpha = 1;
                resolve();
            },config.fadetime,true);
        });
    },

    FADETOCOLOUR: function(from,to,position,scaleX,colour){
        return new Promise(function(resolve, reject) {
            var spr_bg = game.add.graphics(0, 0);
            // this.fadeColor = fadeColor ? fadeColor : 0x000000;
            spr_bg.beginFill(colour, 1);
            spr_bg.drawRect(0, 0, globalConfig.w, globalConfig.h);
            spr_bg.alpha = 0;
            spr_bg.endFill();
            RenJS.tweenManager.chain([
                {sprite:spr_bg,tweenables:{alpha:1},callback:function(){
                    if (from){
                        from.alpha = 0;
                    }
                    if (to) {
                        setNewProperties(to,position,scaleX);
                        to.alpha = 1;
                    }
                }},
                {sprite:spr_bg,tweenables:{alpha:0},callback:function() {
                    spr_bg.destroy();
                    resolve();
                }}
            ],config.fadetime);
        });
    },
    FADETOBLACK: function(from,to,position){
        return RenJS.transitions.FADETOCOLOUR(from,to,position,0x000000)
    },
    FADETOWHITE: function(from,to,position){
        return RenJS.transitions.FADETOCOLOUR(from,to,position,0xFFFFFF)
    }
}

function setNewProperties(sprite,position,scaleX){
    sprite.x = position.x;
    sprite.y = position.y;
    if (scaleX!=null && scaleX!=undefined){
        sprite.scale.x = scaleX;
    }
}

