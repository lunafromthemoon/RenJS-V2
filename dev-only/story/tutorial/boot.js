const globalConfig =  {
  'name': 'Quickstart',
  'w': 800,
  'h': 600,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
  'splash': {
    'loadingScreen': 'assets/gui/loaderloaderbackground.png',
    'loadingBar': {
      'asset': 'assets/gui/loaderloading-bar.png',
      'position': {
        'x': 109,
        'y': 458
      },
      'size': {
        'w': 578,
        'h': 82
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
  ]
}

const RenJSGame = new RenJS.game(globalConfig)
RenJSGame.launch()
