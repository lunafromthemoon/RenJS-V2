const RenJSConfig =  {
  'w': 512,
  'h': 512,
  'guiConfig': 'story/GUI.yaml',
  'storySetup': 'story/Setup.yaml',
  'storyConfig': 'story/Config.yaml',
  'storyText': [
    'story/Story.yaml'
  ],
  'name': "clown",
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.NO_SCALE,
  'loadingScreen': {},
  'fonts': 'assets/gui/fonts.css',
  debugMode: true
}

const RenJSGame = new RenJS.game(RenJSConfig)
RenJSGame.launch()
