class SHOWTITLE extends RenJS.Plugin {

    onCall(params) {
        // load 'title' background in extra section of setup!!!
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
        bg.addChild(title);
        bg.addChild(subtitle);
        this.game.managers.tween.chain([
            {sprite: bg, tweenables: {alpha: 1}},
            {
                sprite: bg, tweenables: {alpha: 0}, callback: () => {
                    bg.destroy();
                    this.game.resolveAction();
                }, delay: this.game.storyConfig.fadetime * 2
            }
        ], true, this.game.storyConfig.fadetime * 2);
    }
}

RenJSGame.addPlugin('SHOWTITLE',SHOWTITLE);



