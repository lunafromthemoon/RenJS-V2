+++
title = "Play and Stop"
date =  2017-09-26T13:12:33-03:00
weight = 3
pre = "<b>2.3 </b>"
+++

These actions allow you to play and stop background music. Play can be used to play sound effects too. Background music will be looped by default, while sound effects will play only once.

### Play
```yaml
    - play music_id|sfc_id: [WITH transition_id]
      [looped: true|false]
```

### Stop
```yaml
    - stop music_id|sfc_id: [WITH transition_id]
```

If no transition is specified, default transition is **FADE** (can be changed). The only other transition available is CUT.

## Examples
```yaml  
  - play morningBGM: WITH FADE
  - play ringtone:
  - stop morningBGM:
```