class ChangeCTC extends RenJS.Plugin {

	onInit(params) {
		let ctc = this.game.gui.hud.mBoxes.default.ctc;
		// remove previous tween
		this.game.tweens.removeFrom(ctc);
		// add the tween you want
		this.game.add.tween(ctc).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None,true,0,-1,true);
	}
}

RenJSGame.addPlugin('ChangeCTC',ChangeCTC)
