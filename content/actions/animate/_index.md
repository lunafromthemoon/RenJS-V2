+++
title = "Animate"
weight = 9
pre = "<b>2.9 </b>"
+++

The _animate_ action allows you to animate cgs. The animation can be a tween of the sprite properties or a spritesheet animation.

### Tweening

Tweening means to change the properties of an element in time, linearly, from the original values to the new values. For example, we can tween the transparency of an image to make it transparent, by tweening its alpha property to zero.

A time should be specified in milliseconds, that will be how long the tween will take to complete.

The properties we can animate through time are:

* Alpha: The transparency of the image. It goes from 0 (completely transparent) to 1 (completely solid).
* Zoom: The scale of the image, as a proportion of the original size. For example, 1 is the same as the original, 0.5 is half of it, and 2 is twice it's original size.
* Position: Where is the image located in the screen, as a coordinate given as x y. The x and y numbers are relative to the screen size, and they can be outside of it too.
* Angle: The rotation of the image, in degrees. The original image has a 0 degrees rotation.

```yaml
    
    - animate cgs_id:
      time: number
      [alpha: number]
      [zoom: number]
      [position: coordinate]
      [angle: number]

```


#### Play tween animation
```yaml  
  - show phone1: AT 100 100
  - animate phone1:
    time: 1000
    position: 50 50
```

### Spritesheet animation

Spritesheet animation is more like traditional animation: you have different frames for an image, and change them every few miliseconds to give the ilusion of movement.

#### Load images in the setup file

To animate a cg in this way, we need to load not only the base (static) image that represents the cg, but we need to load every frame of the animation. A cg can have more than one animation too, all of them should be in the same image file, and the height and width of the image should be specified when loading it.

```yaml  
  cgs:
    phone1: assets/phone1.png
    horse:
      spritesheet: assets/horse-spritesheet-192x144.png 192 144
      animations:
        run: 1 8 20
        jump: 8 12 20
```

In the example, we load a static cg (phone1), and a spritesheet animated cg, horse. The width and height of each frame, in the file specified is 192x144, and it has 2 animations:
- run: from frame 1 to frame 7, with 20 fps
- jump: from frame 8 to frame 11, with 20 fps

The frame 0 represents the static view of this cg.

#### Play spritesheet animations

Show horse and animate the 'run' animation, looped and in its place, for 1000 miliseconds.

```yaml  
  - show horse: AT 180,350
  - animate horse:
    spritesheet: run looped
    time: 1000
```

Start the 'run' animation, looped and in its place, do some other things and then stop it.

```yaml  
  - animate horse:
    spritesheet: run looped
  - deuzi says: The horse will stop after this dialogue.
  - animate horse:
    spritesheet: stop
```

Tween and spritesheet animation at the same time to make the horse run across the screen. After the tween is finished, the spritesheet animation will finish too.

```yaml  
  - animate horse:
    spritesheet: run looped
    position:
      x: 650
      y: 350
    time: 2000
    zoom: 1.5
```