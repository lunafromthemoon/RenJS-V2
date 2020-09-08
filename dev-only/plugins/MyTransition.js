
class Fade2 extends RenJS.Plugin {

	execute(from, to, position, scaleX) {
		return new Promise(resolve => {
			if (!from) return this.game.screenEffects.transition.FADEIN(to, position, scaleX);
        	if (!to) return this.game.screenEffects.transition.FADEOUT(from);
            this.game.managers.tween.chain([
                {
                    sprite: from, tweenables: {alpha: 0}, callback: () => {
                        setNewProperties(to, position, scaleX);
                        resolve();
                    }
                },
                {sprite: to, tweenables: {alpha: 1}}
            ], this.game.defaultValues.fadetime);
        })
	}
}

RenJSGame.addPlugin('FADE2',Fade2)