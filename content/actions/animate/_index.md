+++
title = "Animate"
date =  2017-09-26T13:13:35-03:00
weight = 9
+++

The _animate_ action allows you to animate cgs. The animation can be a tween of the sprite properties, or a spritesheet animation (coming soon).
A time should be specified in milliseconds, that will be how long the tween will take to complete.

```yaml
    
    - animate cgs_id:
      time: number
      [alpha: number]
      [zoom: number]
      [position: coordinate]
      [angle: number]

```