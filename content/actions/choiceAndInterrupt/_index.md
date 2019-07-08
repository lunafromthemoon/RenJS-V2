+++
title = "Choice and Interrupt"
weight = 4
pre = "<b>2.4 </b>"
+++

The _choice_ action allows you to show a menu of text options. The story will then pause and wait for the player to make a decision. 

Each option has a list of further actions to be executed if it's chosen. After executing those actions, the story will continue with the actions right after the _choice_ action. These ations can be any of the available story actions, including another choice or a scene change. If the scene is changed, the actions after the choice will not be executed, but the scene will change immediately.



### Choice
```yaml
    - choice:
      - option1:
        - action1
        - action2
        ...
      - option2:
        - action3
        - action4
        ...
      - optionN:
        - actionN
        - actionN1
        ...
    - actionAfterChoice1
    - actionAfterChoice2
```

### Interrupt
```yaml
    - interrupt number:
      - option1:
        - action1
        - action2
        ...
      - option2:
        - action3
        - action4
        ...
      - optionN:
        - actionN
        - actionN1
        ...
    - actionAfterInterrupt1
    - actionAfterInterrupt2
```

The _interrupt_ action is very similar to the _choice_ action, but the story will not wait for the player to choose, and instead will continue with the actions after the interrupt while showing the options. The number specified referes to the amount of actions the menu will stay shown. So, if you have an _interrupt 5_, the menu will be shown for the 5 next actions, in which the player can use them. If the player doesn't choose any option, then they will be hidden.

### Conditional options
```yaml
    - choice:
      - option1:
        - action1
        - action2
        ...
      - option2 !if (condition1):
        - action3
        - action4
        ...
      - optionN !if (conditionN):
        - actionN
        - actionN1
        ...
    - actionAfterChoice1
    - actionAfterChoice2
```

Sometimes you need to show an option only if a condition is met. In these cases, the conditional option can be used for either choices or interrupts. If the condition is not satisfied, that option will not be shown. Check more about how to make [conditions](../if/).

## Examples
```yaml  
  - choice:
    - Choose Deuzilene:
      - marco says: Good choice
      - var partner: "deuzi"
    - Choose Jair:
      - marco says: You really like a challenge, right?
      - var partner: "jair"
    - Choose no one !if ({readBook}):
      - show marco: surprise
      - marco says: No one has ever completed this task alone before!
      - var partner: "no one"
      - show marco: normal
  - marco: So you've chosen {partner}, are you happy with it?

```