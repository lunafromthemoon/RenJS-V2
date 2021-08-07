const globalConfig =  {
  'name': 'Quickstart',
  'w': 800,
  'h': 600,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
  'loadingScreen': {
    fade: true,
    'background': 'assets/gui_pink/loaderasset1.png',
    'loadingBar': {
      'asset': 'assets/gui_pink/loaderasset2.png',
      "position": {
        "x": 82,
        "y": 460
      },
      "size": {
        "w": 636,
        "h": 84
      }
    }
  },
  'logChoices': true,
  'fonts': 'assets/gui/fonts.css',
  'guiConfig': 'story/GUI.yaml',
  'storyConfig': 'story/Config.yaml',
  storySetup: 'story/tutorial/Setup.yaml',
  'storyText': [
    'story/tutorial/Story.yaml'
  ],
  debugMode:true
}

const RenJSGame = new RenJS.game(globalConfig)
RenJSGame.launch()
