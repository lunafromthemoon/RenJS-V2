+++
title = "Scene"
date =  2017-09-26T13:14:59-03:00
weight = 7
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