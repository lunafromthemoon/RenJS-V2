+++
title = "Show and Hide"
date =  2017-09-26T12:44:07-03:00
weight = 1
pre = "<b>2.1 </b>"
+++

The show action let's you show game objects like backgrounds, characters and cgs. The hide action does the contrary, and allows you to hide them.

---
### Backgrounds

#### Show
```yaml
    - show background_id: [WITH transition_id]
```

The backgrounds will always be behind characters and cgs. 

#### Hide
```yaml
    - hide background_id: [WITH transition_id]
```
If no transition is specified, default transition is **FADE** (can be changed). Check what other [transitions](../transitions/) are available.

### Characters

#### Show
```yaml
    - show character_id: [look_id] [WITH transition_id] [AT position]
      [flipped: true|false]
```

The characters will always be on top of the backgrounds and behind cgs. 
If no look is specified, default look is "normal".
If no position is specified, default position is **CENTER.** A position can be a coordinate like _400,600_ or one of the pre defined positions. The anchor of a character is the center bottom of the sprite (usually the feet), so center position will be center bottom of the screen. Other pre defined positions are:

  * **CENTER**: Center bottom of the screen.
  * **LEFT**: 1/6 of the screen width, bottom.
  * **OUTLEFT**: -1/6 of the screen width, bottom. Outside of the screen.
  * **RIGHT**: 5/6 of the screen width, bottom. 
  * **OUTRIGHT**: 7/6 of the screen width, bottom. Outside of the screen.


#### Hide
```yaml
    - hide character_id: [WITH transition_id]
```

If no transition is specified, default transition is **CUT** (can be changed). Check what other [transitions](../transitions/) are available.

### Show CGS

#### Show
```yaml
    - show cgs_id: [WITH transition_id] [AT position]
      [zoom: number]
      [position: coordinate]
      [angle: number]
```

The cgs will always be on top of characters and cgs. 

#### Hide
```yaml
    - hide cgs_id: [WITH transition_id]
```

If no transition is specified, default transition is **FADE** (can be changed). Check what other [transitions](../transitions/) are available.

## Examples
```yaml
  - show bedroom_lamp_off:
  - show deuzi: AT CENTER WITH FADE
  - show bedroom_lamp_on: WITH FUSION
  - show jair: AT OUTLEFT
  - show jair: AT LEFT WITH MOVE
  - hide deuzi: WITH FADE
```