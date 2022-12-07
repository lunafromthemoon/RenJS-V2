class NUMBERCHOICES extends RenJS.Plugin {

	boxes = null;

	onInit(params) {
		const choiceHandler = this.game.gui.hud.cHandlers.default;
		this.game.screenEffects.transition['NUMBERCHOICES'] = (from, to, position, scaleX) => {
			if (to){
				this.boxes = {}
				for (var i = 0; i < choiceHandler.boxes.length; i++) {
					this.boxes[i] = choiceHandler.boxes[i]
					this.boxes[i].label.changeText((i+1)+". "+this.boxes[i].label.text)
				}
			}
			return this.game.screenEffects.transition.CUT(from, to, position, scaleX);
		}
		this.game.input.keyboard.onPressCallback = (pressed) =>{
			if (!this.boxes) return;
			const chosenBox = this.boxes[pressed-1]
			if (!chosenBox) return;
			this.boxes = null;
			// dispatch box on click
			chosenBox.onInputUp.dispatch();
		}
	}

}

RenJSGame.addPlugin('NUMBERCHOICES',NUMBERCHOICES)