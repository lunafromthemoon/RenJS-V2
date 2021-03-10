class PointAndClick extends RenJS.Plugin {

	onCall(params) {
		// called during runtime to add or remove objects

		const action = params.body.split(" ")[0];
		const obj = params.body.split(" ")[1];
		const infoPaC = this.game.managers.logic.vars.pointAndClick;
		const room = this.game.managers.background.current;
		if (action=="remove"){
			if (obj in room.pointAndClick.map){
				this.game.screenEffects.transition.FADEOUT(room.pointAndClick.map[obj]).then(()=>{
					if (!infoPaC.removed[room.name]){
						infoPaC.removed[room.name]={};
					}
					infoPaC.removed[room.name][obj]=true;
					// if it was previously added, remove it from there too
					if (infoPaC.added[room.name] && infoPaC.added[room.name][obj]){
						delete infoPaC.added[room.name][obj];
					}
					room.pointAndClick.map[obj].destroy();
					this.game.resolveAction();
					
				})
				return;
			}
		}
		if (action=="add"){
			if (!infoPaC.added[room.name]){
				infoPaC.added[room.name]={};
			}
			infoPaC.added[room.name][obj]={
				name:params.name,
				key:params.key ? params.key : params.name,
				x:params.x-room.width/2,
				y:params.y-room.height/2,
				scene:params.scene
			}
			// if it was previously deleted
			if (infoPaC.removed[room.name] && infoPaC.removed[room.name][obj]){
				delete infoPaC.removed[room.name][obj];
			}
			createObject(this.game,room,infoPaC.added[room.name][obj],"FADE");
			this.game.resolveAction();
			return;
		}
		this.game.resolveAction();
	}
}

class PointAndClickTransition extends RenJS.Plugin {

	config = null;
	infoPaC = null;

	onStart() {
		this.config = this.game.setup.pointAndClick;
		if(!this.game.managers.logic.vars.pointAndClick){
			this.game.managers.logic.vars.pointAndClick = {removed:{},added:{}}
		}
		this.infoPaC = this.game.managers.logic.vars.pointAndClick;
	}

	onLoad() { this.onStart();}

	onCall(from, to, position, scaleX) {
		// Transitioning from one background to another
		// Add objects to the background before showing it
		let room = to.name;
		if (this.config[room]){
			for (const obj in this.config[room]){
				// Objects in initial configuration
				if(this.infoPaC.removed[room] && this.infoPaC.removed[room][obj]){
					// object was removed, don't add it
					continue;
				}

				const attr = this.config[room][obj].split(" ");
				let newObj = {
					name:obj,
					key:attr[0],
					x: parseInt(attr[1])-to.width/2,
					y: parseInt(attr[2])-to.height/2,
					scene: attr[3]
				}
				createObject(this.game,to,newObj)
			}
		}
		
		// Objects added during runtime
		if (this.infoPaC.added[room]){
			for (const obj in this.infoPaC.added[room]){
				createObject(this.game,to,this.infoPaC.added[room][obj]);
			}
		}
		
		// FADE TO BLACK to the new background
		if (this.game.config.backgroundColor){
			return this.game.screenEffects.transition.FADETOCOLOUR(from, to, this.game.config.backgroundColor, position, scaleX);
		}
		return this.game.screenEffects.transition.FADETOBLACK (from, to, position, scaleX);
	}
}

function createObject(game,room,obj, transition){
	// Create object in room
	if (!room.pointAndClick){
		room.pointAndClick = {
			map:{}, 
			group:game.add.group()
		}
		room.addChild(room.pointAndClick.group);
	}
	const btn = game.add.button(obj.x,obj.y,obj.key,() => {
		if(!game.managers.story.interpreting){
			// prevent scene interruption
			game.managers.story.startScene(obj.scene);
        	game.resolveAction();
		}
        
    },game,1,0,1,0,room.pointAndClick.group);
	room.pointAndClick.map[obj.name] = btn;
	if (transition){
		btn.alpha=0;
		game.screenEffects.transition.FADEIN(btn);
	}
}

RenJSGame.addPlugin('pointAndClick',PointAndClick)
RenJSGame.addPlugin('PaCTransition',PointAndClickTransition)
