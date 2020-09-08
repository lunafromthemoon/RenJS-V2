
class RAIN2 extends RenJS.Plugin {

	execute(params) {
		this.game.managers.audio.play('rain','bgs',true,'FADE');
        this.game.screenEffects.ambient.addEmitter({
            maxParticles: 400,
            sprite:'rain',
            frames: [0],
            scale: [0.1,0.5],
            speed: {y:[300,500],x:[-5,5]},
            rotation: [0,0]
        },[false, 1600, 5, 0]);

        this.game.screenEffects.ambient.maxLifespan = 1600;
	}
}

RenJSGame.addPlugin('RAIN2',RAIN2)