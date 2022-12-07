class TextInput extends RenJS.Plugin {

	async onCall(params) {
		const str = params.body.split(' ');
		await this.showTextInput(...str);
		this.game.resolveAction();
	}

	onStart(){
		// keep track of which names are changed during game
		this.game.managers.logic.vars.names = []
	}

	onLoad(slot,dataParsed){
		for (const name of dataParsed.vars.names){
			// add names to character objects
			this.game.managers.character.characters[name].config.displayName  = dataParsed.vars[`TextInputName_${name}`]
		}
	}

	showTextInput(propertyType,propertyName,defaultValue){
		return new Promise(resolve=>{
			// lock game scale so it won't resize while showing the text box, or it will look bad
			this.game.lockScale = true;
			// create html input
			const input = this.createInputElement(defaultValue);

			const confirmChange = async ()=>{
				if (input.value != ""){
					// play an sfx if you want
					// this.game.managers.audio.playSFX('buttonsfx');
					if (propertyType == 'var'){
						this.game.managers.logic.vars[propertyName] = input.value;
					}
					if (propertyType == 'name' && this.game.managers.character.characters[propertyName]){
						this.game.managers.logic.vars[`TextInputName_${propertyName}`] = input.value;
						this.game.managers.logic.vars.names.push(propertyName);
						// change also the character name to show in nameBoxes
						this.game.managers.character.characters[propertyName].config.displayName = input.value;
					}
					
					// hide everything
					let tween = this.game.add.tween(input.style).to({opacity:0},750,Phaser.Easing.Linear.None,true);
					await this.game.screenEffects.transition.FADEOUT(btn);
					// destroy everything
					btn.destroy();
					input.remove();
					// re activate hud
					this.game.gui.hud.show();
					// unlock scaling
					this.game.lockScale = false;

					// end action
					resolve();
				}
			}

			// confirm on enter
			input.onkeydown = function(e){
				if(e.keyCode==13){
					confirmChange();
				}
				e.stopPropagation();
			};
			input.style.opacity = 0;
			document.body.appendChild(input);
			// create confirm button ass well
			const btn = this.game.add.button(
				this.game.world.centerX,
				this.game.world.centerY+100,
				"confirmBtn",
				confirmChange,
				this,1,0,2,0);
			btn.anchor.set(0.5);

			// deactivate the hud, so players won't mess up with it while inputing text
			this.game.gui.hud.hide();
			// fade in background and input element
			this.game.screenEffects.transition.FADEIN(btn);
			this.game.add.tween(input.style).to({opacity:1},750,Phaser.Easing.Linear.None,true);
		})
	}

	createInputElement(defaultValue){
		const input = document.createElement("input");
		input.type = "text";
		input.value = defaultValue ? defaultValue : ""
		// add a css class to the input
		// input.className = "canvas-input";
		
		// if you want max input text length, add it here
		// input.setAttribute('maxlength', '10');

		// the input element needs to be scaled along he game
		const scale = this.game.scale.width/this.game.width;
		const inputProps = {
			x:100,
			y:350,
			width:600,
			height:50,
			fontSize:25
		}
		const canvas = this.game.canvas;
		const canvasWidth = canvas.offsetWidth;
		const canvasHeight = canvas.offsetHeight;
		const topLeft = [(canvasWidth/2)-(this.game.scale.width/2)+canvas.offsetLeft, (canvasHeight/2)-(this.game.scale.height/2)+canvas.offsetTop]
		input.style.position = "absolute";
		input.style.left = (topLeft[0]+(inputProps.x*scale))+"px";
		input.style.top = (topLeft[1]+(inputProps.y*scale))+"px";
		input.style.width = (inputProps.width*scale)+"px";
		input.style.height = (inputProps.height*scale)+"px";
		input.style['font-size'] = (inputProps.fontSize*scale)+"px";
		return input;
	}

	async changeProperty(value,propertyType,propertyName){
		
	}
}

RenJSGame.addPlugin('TextInput',TextInput)