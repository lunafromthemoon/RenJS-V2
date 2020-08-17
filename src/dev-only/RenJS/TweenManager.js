function TweenManager(){
    this.current = [];

    this.tween = function(sprite,tweenables,callback,time,start,delay){
        var tween = game.add.tween(sprite);
        delay = !delay ? 0 : delay;
        tween.to(tweenables, time, Phaser.Easing.Linear.None,false,delay);
        if(callback){
            tween.onComplete.addOnce(callback, this);
            tween.callbackOnComplete = callback;
        }        
        tween.tweenables = tweenables;
        if (start){
            RenJS.tweenManager.current = [];
            tween.start();
            if (!RenJS.control.auto) {
                RenJS.waitForClick(this.skip);    
            }            
        }
        RenJS.tweenManager.current.push(tween);
        // if (RenJS.control.skipping){
        //     this.skip();
        // }
        return tween;
    }

    this.chain = function(tweens,time){
        var tm = RenJS.tweenManager;
        tm.current = [];
        var lastTween = null;
        _.each(tweens,function(tw){
            var t = tw.time ? tw.time : time/tweens.length;
            var tween = tm.tween(tw.sprite,tw.tweenables,tw.callback,t,false,tw.delay);
            if (lastTween){
                lastTween.chain(tween);
            }
            lastTween = tween;
        },tm);
        tm.current[0].start();
        if (!RenJS.control.auto) {
            RenJS.waitForClick(tm.skip);    
        }
    }

    this.parallel = function(tweens,time){
        var tm = RenJS.tweenManager;
        tm.current = [];
        _.each(tweens,function(tw){
            var tween = tm.tween(tw.sprite,tw.tweenables,tw.callback,time,false,tw.delay);
            tween.start();
        },tm);
        if (!RenJS.control.auto) {
            RenJS.waitForClick(tm.skip);    
        }
    }

    this.skip = function(){
        if (RenJS.tweenManager.unskippable){
            return;
        }
        var tweens = RenJS.tweenManager.current;
        RenJS.tweenManager.current = [];
        _.each(tweens,function(tween){
            tween.stop(false);
            _.each(tween.tweenables,function (value,property) {
                tween.target[property] = value;
            });
            if (tween.callbackOnComplete){
                tween.callbackOnComplete();
            }            
        });        
    }
}

