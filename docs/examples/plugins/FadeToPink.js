class Fade2Pink extends RenJS.Plugin {

    // Transitions don't need to call resolveAction, but return a Promise

	onCall(from, to, position, scaleX) {
        return this.game.screenEffects.transition.FADETOCOLOUR(from, to, 0xF3969A, position, scaleX);
	}
}

RenJSGame.addPlugin('FADETOPINK',Fade2Pink)