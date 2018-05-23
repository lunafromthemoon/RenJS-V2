+++
title = "Say and Text"
date =  2017-09-26T12:44:23-03:00
weight = 2
+++

These actions let you show text inside the text box. The difference between them is that the _say_ action will also display the name of the character inside the name box, in the colour of the propery _speechText_ defined for that character.

### Text
```yaml
    - text: text
```

### Say
```yaml
    - character_id says: text
```

The text will be shown letter by letter inside the text box and after it is displayed whole, the _ctc_ (click to continue) will be shown. After this the game will wait until the player clicks anywhere on the screen to continue with the next action.

## Examples
```yaml  
  - text: It's the first day of school and you're wondering who's that girl that's been looking at you all morning
  - deuzi says: Welcome {name}!
  - deuzi says: How are you today?
  - text: How does she know your name?
```