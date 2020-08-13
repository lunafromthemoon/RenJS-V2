RenJS.ambient = {
    emitters: [],
    clearFunctions: [],
    addEmitter: function(options){
        var emitter = game.add.emitter(game.world.centerX, -32, options.maxParticles);
        emitter.width = game.world.width * 1.5;
        emitter.makeParticles(options.sprite, options.frames);        
        if (options.scale){
            emitter.maxParticleScale = options.scale[1];
            emitter.minParticleScale = options.scale[0];    
        }
        if (options.speed && options.speed.y){
            emitter.setYSpeed(options.speed.y[0], options.speed.y[1]);
        }
        if (options.speed && options.speed.x){
            emitter.setXSpeed(options.speed.x[0], options.speed.x[1]);
        }        
        emitter.gravity = options.gravity ? options.gravity : 0;
        if (options.rotation) {
            emitter.minRotation = options.rotation[0];
            emitter.maxRotation = options.rotation[1];    
        }
        RenJS.ambient.emitters.push(emitter);
    },
    BGS: function(sound){
        if (sound) {
            RenJS.audioManager.play(sound,"bgs",true,"FADE");   
        }
    },
    CLEAR: function(){
        if (RenJS.ambient.maxLifespan){
            _.each(RenJS.ambient.emitters,function(emitter){
                emitter.on = false;
            });            
            setTimeout(function() {
                _.invoke(RenJS.ambient.emitters,"destroy");
                RenJS.ambient.emitters = [];
            }, RenJS.ambient.maxLifespan*2);
            RenJS.ambient.maxLifespan = 0;
        }
        if (RenJS.ambient.animation){
            RenJS.ambient.animation.stop(false,true);
            RenJS.ambient.animation.spriteParent.destroy();
        }
        _.each(RenJS.ambient.clearFunctions,function(clearFunction){
                clearFunction();
        });
        RenJS.ambient.clearFunctions = [];
        RenJS.audioManager.stop("bgs","FADE");
    },   
    STATIC: function(){
        var static = RenJS.storyManager.behindCharactersSprites.create(game.world.centerX,game.world.centerY, 'static');
        static.anchor.set(0.5);
        static.scale.set(2.5);
        RenJS.ambient.animation = static.animations.add('static');
        RenJS.audioManager.play("staticSound","bgs",true,"CUT"); 
        RenJS.ambient.animation.play(10, true,true);
        RenJS.ambient.animation.spriteParent = static;
    },
    RAIN: function() {
        RenJS.audioManager.play("rain","bgs",true,"FADE"); 
        RenJS.ambient.addEmitter({
            maxParticles: 400,
            sprite:"rain",
            frames: [0],
            scale: [0.1,0.5],
            speed: {y:[300,500],x:[-5,5]},
            rotation: [0,0]
        });        
        RenJS.ambient.emitters[0].start(false, 1600, 5,0);
        RenJS.ambient.maxLifespan = 1600;
    },
    SAKURA: function(){
        RenJS.ambient.addEmitter({
            maxParticles: 200,
            sprite:"sakura",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2,0.6],
            speed: {y:[20,100],x:[120,150]},
            rotation: [0,40]
        });
        RenJS.ambient.addEmitter({
            maxParticles: 150,
            sprite:"sakura",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8,1.2],
            speed: {y:[50,150],x:[100,120]},
            rotation: [0,40]
        });
        RenJS.ambient.emitters[0].start(false, 6000, 20);
        RenJS.ambient.emitters[1].start(false, 5000, 40);
        RenJS.ambient.maxLifespan = 6000;
    },
    BADTRIP: function(){
        RenJS.ambient.drugsFlag = 2;
    },
    DRUGS: function(){
        console.log("doing drugs");
        
        var bg = RenJS.storyManager.behindCharactersSprites.create(0,0);
        bg.width = globalConfig.w;
        bg.height = globalConfig.h;
        var fragmentSrc = [
            // "precision mediump float;",
            // "uniform vec2      resolution;",
            // "uniform float     time;",
            // "uniform vec2       mouse;",

            // "void main( void )",
            // "{",
            //     "vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;",

            //     "vec3 c = vec3( 0.0 );",

            //     "float amplitude = 0.50;",
            //     "float glowT = sin(time)*mouse[0] + 0.5;",
            //     "float glowFactor = mix( 0.0, 0.10, glowT );",

            //     "c += vec3(0.02, 0.03, 0.13) * ( glowFactor * abs( 1.0 / sin(p.x + sin( p.y + time*0.2 ) * amplitude ) ));",
            //     "c += vec3(0.02, 0.10, 0.03) * ( glowFactor * abs( 1.0 / sin(p.x + cos( p.y + time*0.2+1.00 ) * amplitude+0.1 ) ));",
            //     "c += vec3(0.15, 0.05, 0.20) * ( glowFactor * abs( 1.0 / sin(p.y + sin( p.x + time*0.2+1.30 ) * amplitude+0.15 ) ));",
            //     "c += vec3(0.20, 0.05, 0.05) * ( glowFactor * abs( 1.0 / sin(p.y + cos( p.x + time*0.2+3.00 ) * amplitude+0.3 ) ));",
            //     "c += vec3(0.17, 0.17, 0.05) * ( glowFactor * abs( 1.0 / sin(p.y + cos( p.x + time*0.2+5.00 ) * amplitude+0.2 ) ));",

            //     "gl_FragColor = vec4( c, 0.0 );",
            // "}"
            "precision mediump float;",
            "uniform float time;",
            "uniform vec2 resolution;",
            "uniform vec2 mouse;",

            "const float Pi = 3.14159;",
            "const int zoom = 71;",
            "const float speed = .1;",
            "float fScale = 1.1;",

            "void main(void)",
            "{",
                
                "vec2 uv = gl_FragCoord.xy / resolution.xy;",
                "vec2 p=(4.0*gl_FragCoord.xy-resolution.xy)/max(resolution.x,resolution.y)+3.*(0.1/time);",
                
                "float ct = time * speed * 2. * mouse[1];",
                
               " for(int i=1;i<zoom;i++) {",
                    "vec2 newp=p;",
                    "newp.x+=0.25/float(i)*cos(float(i)*p.y+time*cos(ct)*0.3/40.0+0.03*float(i))*fScale+10.0;        ",
                    "newp.y+=0.5/float(i)*cos(float(i)*p.x+time*ct*0.3/50.0+0.03*float(i+10))*fScale+15.0;",
                    "p=newp;",
                "}",
                
                "vec3 col=vec3(1.5*sin(1.0*p.x)+0.5, 0.5*cos(3.0*p.y)+0.3, cos(p.x+p.y))-mouse[0];",
                "gl_FragColor=vec4(col, 0.0);",
            "}"
        ];
        //  The following properties are available (shown at default values)

        //  filter.speed = 10.0;
        //  filter.intensity = 0.30;
        var filter = new Phaser.Filter(game, null, fragmentSrc);
        filter.setResolution(globalConfig.w, globalConfig.h);
        bg.filters = [filter];
        var counter = 2000;
        RenJS.ambient.drugsFlag = 1;
        RenJS.ambient.drugsState = 0;
        var interval = setInterval(function(){ 
            var speed = RenJS.ambient.drugsFlag == 1 ? 1 : game.rnd.integerInRange(1,10);
            filter.update({x:counter,y:speed}); 
            // console.log(game.input.activePointer.x);
            // console.log(counter);
            if (RenJS.ambient.drugsState == 0){
                counter -= 20;
                if (counter<=20){
                    RenJS.ambient.drugsState = 1;
                }
            } else if (RenJS.ambient.drugsState == 2){
                counter += 25;
                if (counter >= 2200){                    
                    RenJS.storyManager.behindCharactersSprites.remove(bg,true);
                    clearInterval(interval);
                }
            }

            
        }, 60);
        RenJS.ambient.clearFunctions.push(function(){
            RenJS.ambient.drugsState = 2;
        });  
    },
    SNOW: function(){
        RenJS.ambient.addEmitter({
            maxParticles: 200,
            sprite:"snowflakes",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2,0.6],
            speed: {y:[20,100]},
            rotation: [0,40]
        });
        RenJS.ambient.addEmitter({
            maxParticles: 150,
            sprite:"snowflakes",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8,1.2],
            speed: {y:[50,150]},
            rotation: [0,40]
        });
        RenJS.ambient.addEmitter({
            maxParticles: 150,
            sprite:"snowflakes_large",
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.5,1],
            speed: {y:[100,200]},
            rotation: [0,40]
        });
        RenJS.ambient.emitters[0].start(false, 6000, 20);
        RenJS.ambient.emitters[1].start(false, 5000, 40);
        RenJS.ambient.emitters[2].start(false, 4000, 1000);
        RenJS.ambient.maxLifespan = 6000;
    }

}