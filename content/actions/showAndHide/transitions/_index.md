+++
title = "Transitions"
date =  2017-09-26T19:40:52-03:00
weight = 12
pre = "<b>2.1.1 </b>"
+++

The transitions are used everytime we show, hide or change an image. This affects how that will be achieved. There are a few usual transitions ready to use with the game, but you can check the file RenJS/Transitions.js to see how to create your own transition.

### CUT
The most common transition is CUT, that means the image will be simply shown (or hidden) instantly.

```yaml
  - show deuzi: normal
  - show deuzi: angry WITH CUT
```

### FADE
The FADE transition will interpolate the alpha of the image, taking some time. To show an image it will go from alpha 0 to alpha 1, in a FADE IN. To hide and image it will do the contrary, going from alpha 1 to alpha 0 in a FADE OUT. To change on image for another, it will first do a FADE IN and then FADE OUT.

```yaml
  - show deuzi: WITH FADE AT CENTER
```


### FUSION
If used to show or hide an image, FUSION will behave exactly like FADE, but when changing images, FUSION will do both the FADE IN and FADE OUT at the same time, and it will look aproximately like one image is fusing with the other one.

```yaml
  - show room_dark_lamp_off:
  - show room_dark_lamp_on: WITH FUSION
```

### FADETOBLACK, FADETOWHITE, FADETOCOLOR
The whole screen will be covered by a color in a FADEIN, the changes to the image will be performed, and then a FADEOUT of the overlay will reveal the changes.

```yaml
  - hide jair: WITH FADETOBLACK
```

### MOVE
Another important transition is MOVE, normally used for characters, will interpolate the current position of the image to the new one. For example, to show a character entering the screen from the right first you would show it in the position OUTRIGHT (outside of the screen, to the right side), and then show it at another position, using the MOVE transition.

```yaml
  - show deuzi: WITH CUT AT OUTRIGHT
  - show deuzi: WITH MOVE AT CENTER
```