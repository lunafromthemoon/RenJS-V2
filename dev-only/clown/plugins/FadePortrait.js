class FadePortrait extends RenJS.Plugin {

	onInit(){
		this.portraits = this.game.add.group()
		this.game.screenEffects.transition['FadePortrait'] = (from, to, position, scaleX) => {
			this.game.world.bringToTop(this.portraits);
			to.parent.remove(to)
			this.portraits.add(to)
			return this.game.screenEffects.transition.FADEIN(to, position, scaleX);
			
		}
	}	    
}

RenJSGame.addPlugin('FadePortrait',FadePortrait)


class SayTransition extends RenJS.Plugin {

	onInit(){
		this.portraits = this.game.add.group()
		this.game.screenEffects.transition['SayTransition'] = (from, to, position, scaleX) => {
			console.log(to.key)
			if (to.key.includes('clown_')){
				this.game.world.bringToTop(this.portraits);
				to.parent.remove(to)
				this.portraits.add(to)
			}
			return this.game.screenEffects.transition.CUT(from,to, position, scaleX);
			
		}
	}	    
}

RenJSGame.addPlugin('SayTransition',SayTransition)