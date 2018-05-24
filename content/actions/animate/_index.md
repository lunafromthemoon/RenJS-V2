+++
title = "Animate"
date =  2017-09-26T13:13:35-03:00
weight = 9
pre = "<b>2.9 </b>"
+++

The _animate_ action allows you to animate cgs. The animation can be a tween of the sprite properties, or a spritesheet animation (coming soon).
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

## Examples
```yaml  
  - show phone1: AT 100 100
  - animate phone1:
    time: 1000
    position: 50 50
```