class ToggleButton extends RenJS.Plugin {

	toggleBtn = null;
	pushedFrames = [2,2,2,2];
	normalFrames = [1,0,2,0];

	onInit(params) {
		// find the phaser button element in the HUD
		this.toggleBtn = this.game.gui.hud.children.find(btn=>{
			return btn.component && btn.component.binding == "auto";
		});

		// get the frames to use when it's pushed and normal, acording to how many frames it has
		// get the frames to use when it's pushed and normal, acording to how many frames it has

		if (this.toggleBtn.animations.frameTotal === 2){
			this.pushedFrames = [1,1,1,1];
			this.normalFrames = [1,0,1,0];
        } 

        /* 
		auto game just sets the variable game.control.auto to true, 
		when tapping, auto is set to false and it stops auto playing
		to reset the toggle button, we need to listen to this control.auto variable change
		we can do that with setters and getters
		*/

		Object.defineProperty(
		    this.game.control, 
		    'auto', 
		    {
		    	// value: false,
		    	set: (autoOn) => { 
		    		this.autoValue = autoOn;
		    		const frames = autoOn ? this.pushedFrames : this.normalFrames;
	    			this.toggleBtn.setFrames(...frames)
	    			if (autoOn){
	    				console.log("Auto is on, do something here!!!");
	    			}
		    	},
		        get: () => { 
		            return this.autoValue;
		        }
		    }
		);
	}
}

RenJSGame.addPlugin('ToggleButton',ToggleButton)
