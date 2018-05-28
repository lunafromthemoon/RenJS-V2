+++
title = "Adding New Transitions"
date =  2018-05-16T14:41:12+02:00
weight = 5
pre = "<b>6.1 </b>"
+++

The transitions are used everytime we show, hide or change an image. This affects how that will be achieved. There are a few usual transitions ready to use with the game: CUT, FADE, FUSION, MOVE. This are usually enought in a very classical game, but you don't have to be limited to them. Creating transitions is really easy if you know some javascript.

All of the code concerning the transitions is inside the file RenJS/Transitions.js, by reading how each of the current transitions is made, you'll learn what you need to do to create your own. 

The transitions file contains a map called RenJS.transitions, this means we are assigning all of their contents to a map called transitions inside the global object RenJS. 

Each of the key-value contents of this map is a transition. The key is the name, and the value is a function that will transform one image to the other. In this case, the name is 'CUT', and that's the name you call from your story when showing or hiding images. The parameters received are: 

* from: The old image. It could be a null object if, for example, a new characters appears on screen.
* to: The new image. It could be a null object if, for example, a character dissapears from the screen.
* position: The new position of the image (x and y). This is important for character or object transitions, that could move from one place to another, but not so much for backgrounds.
* scaleX: This is the scale of the image, but usually it's meant to indicate if it's flipped (value is -1) or not (value is 1).

## CUT

Let's see the first element in this map, the most simple transition: CUT. This transition simply hides the old image and shows the new one.

```js
CUT: function(from,to,position,scaleX){
    if (from){
        from.alpha = 0;
    }
    if (to) {
        to.alpha = 1;
        setNewProperties(to,position,scaleX);
    }
    RenJS.resolve();
},
```


Normally, in a game, when you show an image, you create the sprite object, that will be added to the screen and shown. When you want to hide that image, you destroy the sprite object.

In RenJS, we will use the same sprites many times, so when the game starts, all of the sprites are created and hidden by making them transparent (property alpha 0). So when you want to show them, you simply make them solid again (property alpha 1), and when you want to hide them, you make them transparent again (property alpha 0).

Taking this into account, we can see how the CUT function works:

1. If we have a _from_ image, we change its alpha to 0
2. If we have a _to_ image, we change its alpha to 1, and then call the function setNewProperties, that will transfer position and scale to the new sprite
3. We tell the engine we're ready to continue with the story

The last line, RenJS.resolve() is really important. We need to let the engine know when we're ready to continue. In this case it's straightforward: the function finishes and we can continue; but we will see next how that is not always the case.

## FADE

In a FADE transition the old image fades out (it gradually becomes transparent), and the new image fades in (it gradually becomes solid). To achieve this we need to tween the alpha property. Tweening, in digital animations, refers to interpolating properties of an image through time, to animate them. To make the process easier, RenJS has a Tween manager that allows you to tween an image normally or perform chained or parallel tweens. 

For the FADE transition we use two additional transitions, that can not be called from the story: FADEOUT and FADEIN. They will be called authomatically when the FADE transition receives only one the images. If it only has a _from_ image it will do a FADEOUT, if there's only a _to_ image it will do a FADEIN.

FADEOUT and FADEIN are really simple. They simply tween the image and tell the engine to continue.

```js
FADEOUT: function(from){
    RenJS.tweenManager.tween(from,{ alpha: 0 },RenJS.resolve,config.fadetime,true);
},
FADEIN: function(to,position,scaleX){
    setNewProperties(to,position,scaleX);
    RenJS.tweenManager.tween(to,{ alpha: 1 },RenJS.resolve,config.fadetime,true);        
},
```

With the tweenManager, we can call the function tween that takes:

* An image to tween
* A map of properties to tween (from the current value of the image)
* A callback function (what to do after the tween is finished)
* An interpolation time
* If the tween should start running immediately
* A time delay

In FADEOUT we send the _from_ image, that we want to hide. The property is then the alpha of the image, and the value we want to get to is 0. As the current value of the image alpha is 1, the tween will interpolate the alpha from 1 to 0. The callback is the resolve function, since we don't want to do anything else after the image is hidden. The fadetime is the value determined by the Defaults.js file as "fadetime". And we also need to send a true as a start parameter, we want it to start right away. As we don't need any delay, we can skip that parameter.

The FADEIN transition is similar, but we do the opposite, we need to show the image. Also, we need to pass the new position and scaleX properties to the image, so the first thing we do is call setNewProperties, and then we do the tween. The only change from the FADEOUT case is that we now want to tween to alpha 1, intead of 0, to show it.

```js
FADE: function(from,to,position,scaleX){
    if (!from){
        RenJS.transitions.FADEIN(to,position,scaleX);
        return;
    } 
    if (!to){
        RenJS.transitions.FADEOUT(from);
        return;
    }
    RenJS.tweenManager.chain([
        {sprite:from,tweenables:{alpha:0},callback:function(){
            setNewProperties(to,position,scaleX);
        }},
        {sprite:to,tweenables:{alpha:1},callback:RenJS.resolve}
    ],config.fadetime);               
},
```

When we have both images, we need to do something a bit different: We need to chain both tweens, the one that will hide the old image and the one that will show the new one.

For that we call the _chain_ function of the tweenManager. We need to send two things:

* A list of tweens to chain
* A global time of execution

The list of tweens contains elements with:
* sprite: The image
* tweenables: The properties for tweening
* callback: The callback function
* time: The interpolation time (if skipped, the time will be the global time will be divided by the amount of elements on this list)
* delay: The delay to start this tween after the previous one

So, basically, the same information a normal tween takes, but repeated for every tween in the chain. In our case, the first tween is hiding the old image, and its callback if a function that will set the properties of the new image before showing it. The second tween is showing the new image.

### MOVE

```js
MOVE: function(from,to,position,scaleX){
    if (!from || !to){
        RenJS.transitions.CUT(from,to,position);
        return;
    } 
    RenJS.tweenManager.tween(from,{ x:position.x,y:position.y },function(){
        setNewProperties(to,position,scaleX);
        from.alpha = 0;
        to.alpha = 1;
        RenJS.resolve();
    },config.fadetime,true);
},
```

The _move_ transition will tween not the alpha, but the position of an image. In this case, if we don't have both images, the equivalence will be with a CUT transition of showing or hiding the image. If we do have them, we need to tween the first image's position, that is, the _x_ and _y_ properties, to the new properties. To finish, we need to set the new properites to the new image, and do a CUT transition. In most cases, the _from_ and _to_ image in this case is the same one, so this last part won't do very much. Finally, the resolve function is called so the game can continue.

There are some more transitions that you can check in the file, but changing properties and tweening is what you should know about the transitions, so you can make your own. 

When you add a new transition, you will call it from the story like you do with the others:

```js
MYTRANSITION: function(from,to,position,scaleX){
    //your transition's code
    RenJS.resolve();    
},
```

```yaml
  - show char1: WITH MYTRANSITION
```