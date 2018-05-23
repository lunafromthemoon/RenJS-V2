+++
title = "Wait time or click"
date =  2017-09-26T13:14:26-03:00
weight = 8
+++

The _wait_ action allows you to force the player to wait for some time or until they click anywhere on the screen.

```yaml
    
    - wait: number|click

```

## Examples
```yaml  
  - deuzi says: Ok, tell me when you're ready!
  - wait: click
  - deuzi says: Let's go then!!!
```