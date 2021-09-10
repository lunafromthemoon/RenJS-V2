class PointAndClick extends RenJS.Plugin {

	config = null;
	infoPaC = null;

	onStart() {
		this.config = this.game.setup.pointAndClick;
		// create new point and click added and removed data
		this.infoPaC = {removed:{},added:{}}
		this.game.managers.logic.vars.pointAndClick = this.infoPaC;
	}

	onLoad(slot,data) { 
		// load point and click data from saved variables
		this.infoPaC = data.vars.pointAndClick;
	}

	onInit(){
		// Add new point and click transition
		this.game.screenEffects.transition['PaCTransition'] = (from, to, position, scaleX) => {
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
					this.createObject(to,newObj)
				}
			}
			
			// Objects added during runtime
			if (this.infoPaC.added[room]){
				for (const obj in this.infoPaC.added[room]){
					this.createObject(to,this.infoPaC.added[room][obj]);
				}
			}
			
			// enable input globally just in case
			this.game.input.enabled = true;
			// FADE TO BLACK to the new background
			return this.game.screenEffects.transition.FADETOBLACK(from, to, position, scaleX);
		}
	}

	createObject(room,obj, transition){
		// Create object in room
		if (!room.pointAndClick){
			room.pointAndClick = {
				map:{}, 
				group:this.game.add.group()
			}
			room.addChild(room.pointAndClick.group);
		}
		const btn = this.game.add.button(obj.x,obj.y,obj.key,async () => {
			if(!this.game.managers.story.interpreting){
				// remove objects input so they won't interrupt the scene
				// Call activate after each scene
				room.pointAndClick.group.ignoreChildInput = true;
				// prevent scene interruption
				await this.game.managers.story.startScene(obj.scene);
	        	this.game.resolveAction();
			}
	        
	    },this.game,1,0,1,0,room.pointAndClick.group);
		room.pointAndClick.map[obj.name] = btn;
		if (transition){
			btn.alpha=0;
			this.game.screenEffects.transition.FADEIN(btn);
		} else {
			// Objects are added but not clickable until activated explicitly in the story
			room.pointAndClick.group.ignoreChildInput = true;
		}
	}

	onCall(params) {
		// called during runtime to activate, add or remove objects
		const action = params.body.split(" ")[0];
		const obj = params.body.split(" ")[1];
		const infoPaC = this.game.managers.logic.vars.pointAndClick;
		const room = this.game.managers.background.current;
		if (params.body == 'activate'){
			// make objects clickable
			room.pointAndClick.group.ignoreChildInput = false;
			this.game.resolveAction();
			return
		}
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
			this.createObject(room,infoPaC.added[room.name][obj],"FADE");
			this.game.resolveAction();
			return;
		}
		this.game.resolveAction();
	}
}

RenJSGame.addPlugin('PointAndClick',PointAndClick)
