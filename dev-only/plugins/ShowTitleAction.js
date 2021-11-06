class SHOWTITLE extends RenJS.Plugin {

	async onCall(params) {
		const bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title');
        bg.alpha = 0;
        bg.anchor.set(0.5);
        const style = {...this.game.gui.hud.cHandlers.default.config.text.style};
        style.fontSize = '50pt';
        const title = this.game.add.text(0, -20, params.title, style);
        style.fontSize = '25pt';
        const subtitle = this.game.add.text(0, 40, params.subtitle, style);
        subtitle.anchor.set(0.5);
        title.anchor.set(0.5);
        console.log(style)
        console.log(params)
        bg.addChild(title);
        bg.addChild(subtitle);
        await this.game.screenEffects.transition.FADEIN(bg);
        setTimeout(async ()=>{
            await this.game.screenEffects.transition.FADEOUT(bg)
            bg.destroy();
            this.game.resolveAction();
        },this.game.storyConfig.fadetime * 2)
	}
}

RenJSGame.addPlugin('SHOWTITLE',SHOWTITLE);
