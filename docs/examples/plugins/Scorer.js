class Scorer extends RenJS.Plugin {

    scorer = null;
    text = null;

    async onCall(params) {
      if (params.body == "REMOVE" && this.scorer){
          // remove scorer
          await this.game.screenEffects.transition.FADEOUT(this.scorer)
          this.scorer.destroy();
          this.scorer = null;
          this.game.resolveAction();
          return;
      }
      else if (params.body == "REMOVE WITHNOFADE" && this.scorer){
          // remove scorer
          this.scorer.destroy();
          this.scorer = null;
          this.game.resolveAction();
          return;
      }
        if (this.scorer){
            this.game.managers.audio.playSFX('scoreUpdateSFX');
            // Just change the scorer value
            this.text.text = this.game.managers.logic.parseVars(params.body);
        } else {
            this.scorer = this.game.add.sprite(this.game.world.centerX+350, this.game.world.centerY-250, 'scorer'); //loads scorer gui under extras
            this.game.gui.hud.addChild(this.scorer);
            this.scorer.alpha = 0;
            this.scorer.anchor.set(0.5);
            const style = {...this.game.gui.hud.cHandlers.default.config.text.style};
            const message = this.game.managers.logic.parseVars(params.body);
            this.text = this.game.add.text(0, 0, message, style);
            this.text.anchor.set(0.5);
            this.scorer.addChild(this.text);
            this.game.managers.audio.playSFX('scoreUpdateSFX');
            await this.game.screenEffects.transition.FADEIN(this.scorer);
        }
        this.game.resolveAction();
    }
}

RenJSGame.addPlugin('Scorer',Scorer);
