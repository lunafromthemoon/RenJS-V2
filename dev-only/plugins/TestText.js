var title;

class TestText extends RenJS.Plugin {

	onCall(params) {
        	//	Here we add a Sprite to the display list
	    const sprite = this.game.add.sprite(100, 100, 'phone1');
	    sprite.scale.set(2);

	    const style = {...this.game.gui.hud.mBoxes.default.config.text.style};
        style.fontSize = '50pt';
        title = this.game.add.text(50, 50, "TEST AKLJDS asdfasdf  qwer sazdf aqwer asd", style);

        title.addColor('#ffff00', 6)
	    //	A mask is a Graphics object
	    const mask = this.game.add.graphics(0, 0);

	    //	Shapes drawn to the Graphics object must be filled.
	    mask.beginFill(0xffff00,0.5);

	    //	Here we'll draw a circle
	    mask.drawRect(title.x, title.y, title.width, title.height)
	    // debugger

	    //	And apply it to the Sprite
	    //title.mask = mask;



	}
}

RenJSGame.addPlugin('TestText',TestText)

