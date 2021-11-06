class AttackEffect extends RenJS.Plugin {

	onCall(params) {
        let flashEffect = this.game.screenEffects.effects.FLASHIMAGE.bind(this.game.screenEffects.effects);
        flashEffect({
            image:"chainattack1",
            sfx:"lashSFX",
            shakeScreen:true
        }).then(()=>{
            flashEffect({
                image:"chainattack2",
                sfx:"lashSFX",
                shakeScreen:true
            }).then(()=>{
                flashEffect({
                    image:"chainattack3",
                    sfx:"lashSFX",
                    shakeScreen:true
                }).then(()=>{
                    // resolve to continue the story
                    this.game.resolveAction();
                });
            });
        });
	}
}

RenJSGame.addPlugin('ATTACK',AttackEffect)