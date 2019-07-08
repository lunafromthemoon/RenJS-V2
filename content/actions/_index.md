+++
title = "Actions Guide"
weight = 2
chapter = true
pre = "<b>2. </b>"
+++

### Actions Guide

# How to write the story

The story script is not that hard, you just need to learn how to format a few actions that will allow you to write the story you want to tell. There should be an action for anything you want to do in your story. For example, "play" is an action that will play music, "show" is an action that will show an image.
One importan thing to remember is indentation, at level 0 there will be the names of the scenes, preceded by all of its actions, indented by two spaces. 

Every kind of action has it's own format, but usually it's something like this:

```yaml
  action actor: extra parameters
```

The "action" will be the name of the action, the "actor" the object over whom it will do the action, and the extra parameters can be anything. For example, the actions show, hide and play all follow this format. There are some exceptions, like the actions text, that doesn't require an actor, or say, that is inverted as "actor says" to be written more naturally.

## Cheatsheet

### [Show and hide](/showandhide)
```yaml
  - show [BACKGROUND|CHARACTER|CGS]: [WITH TRANSITION] [AT POSITION]
  - hide [BACKGROUND|CHARACTER|CGS]: [WITH TRANSITION]
```

Transitions: CUT, FADE, FUSION, MOVE, FADETOBLACK, FADETOWHITE
Positions: OUTLEFT, LEFT, CENTER, RIGHT, OUTRIGHT
### [Say and text](/sayandtext)
```yaml
  - CHARACTER says: TEXT
  - text: TEXT
```

### [Play and stop](/playandstop)
```yaml
  - play [MUSIC|SFX]: [WITH TRANSITION]
  - stop [MUSIC|SFX]: [WITH TRANSITION]
```

### [Choice and interrupt](/choice and interrupt)

```yaml
  - choice:
    - OPTION1:
      - ACTIONS FOR OPTION1
    - OPTION2:
      - ACTIONS FOR OPTION2

  - interrupt NUMBER:
    - OPTION1:
      - ACTIONS FOR OPTION1
    - OPTION2:
      - ACTIONS FOR OPTION2
```

### [Variables](/variables)
```yaml
  - var NAME: [TEXT|NUMBER|BOOLEAN]
  - text: foo {NAME} bar
```

### [If](/if)
```yaml
  - if (CONDITION):
  	- ACTIONS FOR CONDITION TRUE
  [
  - else:
  	- ACTIONS FOR CONDITION FALSE
  ]
```

### [Scene](/scene)
```yaml
SCENE1:
  - ACTIONS FOR SCENE 1
  - scene: SCENE2

SCENE2:
  - ACTIONS FOR SCENE 2
```

### [Wait for time or click](/wait)
```yaml
  - wait: [NUMBER|click]
```

### [Animate](/animate)
```yaml
  - animate CGS:
      time: NUMBER
      [alpha: NUMBER]
      [zoom: NUMBER]
      [position: COORDINATE]
      [angle: NUMBER]
```

### [Call](/call)
```yaml
  - call FUNCTION:
    [PARAM1: VALUE1]
    [PARAM2: VALUE2]
```

### [Effects and ambients](/effectsandambients)
```yaml
  - ambient AMBIENT:
    [PARAM1: VALUE1]
    [PARAM2: VALUE2]
  - effect EFFECT:
    [PARAM1: VALUE1]
    [PARAM2: VALUE2]
```

Ambients: RAIN, SAKURA, SNOW, DRUGS, BADTRIP, CLEAR

Effects: SHAKE, SOUND, ROLLINGCREDITS, SHOWTITLE, THUNDER, EXPLOSION