+++
title = "If"
date =  2017-09-26T13:13:18-03:00
weight = 6
+++

The _if_ action allows you to branch your story. The _if_ action contains a condition and a list of actions that will only be executed if the condition is true. Optionally, it can also have a list of actions to execute if the condition is false. Either list of actions can contain whatever action available. After the right actions are done, the story will continue with the actions after the _if_ (or else, if present).

```yaml
    - if (condition):
      - action1
      - action2
      ...
    [- else:
       - action3
       - action4
       ...]
    - actionAfterIf1
    - actionAfterIf2

```

The condition can be any boolean variable or operation, as seen in the [variables](../var/) section. 

## Examples
```yaml  
  - if (partner == "deuzi"):
    - show deuzi: happy
    - deuzi says: I knew it would be me!
  - else:
    - text: Deuzilene looks disappointed but tries to hide it.
```