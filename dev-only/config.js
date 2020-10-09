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
  'guiConfig': 'GUI.yaml',
  'storyConfig': 'story/Config.yaml',
  // 'guiConfig': 'story/GUI.yaml',
  storySetup: 'story/Setup.yaml',
  'storyText': [
    'story/TutorialStory.yaml'
  ]
}

const RenJSGame = new RenJS.game(globalConfig)
RenJSGame.launch()
