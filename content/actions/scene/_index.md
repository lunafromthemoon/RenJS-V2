+++
title = "Scene"
weight = 7
pre = "<b>2.7 </b>"
+++

The _scene_ action is used to change from one scene to the other. Every scene in the story has a name and a list of actions that conform it. The scenes are not numbered, so to change from one to the other, an explicit call should be made.
If no scene is called before the end of the scene, the game will return to the main menu.


```yaml
    
    scene1:
      - action1
      - action2
      - action3
      ...
      - scene: scene2

    scene2:
      - action4
      - action5
      ...

```

## Examples
```yaml  
start:
  - show marco: WITH FADE
  - marco says: Good morning student, are you ready to choose your partner?
  - choice:
    - Yes:
      - scene: choosePartner
    - No:
      marco says: What's the problem?

choosePartner: 
  - marco says: We should go to the teachers room
  - show teachersRoom:

```