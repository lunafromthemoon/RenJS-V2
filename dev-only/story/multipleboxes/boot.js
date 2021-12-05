const globalConfig =  {
  'name': 'Quickstart',
  'w': 800,
  'h': 600,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
  'loadingScreen': {
    'background': 'assets/gui/quickstartbg.png',
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
  'fonts': 'assets/gui/fonts.css',
  'guiConfig': 'story/multipleboxes/GUI.yaml',
  'storyConfig': 'story/Config.yaml',
  'storyAccessibility': 'story/Accessibility.yaml',
  storySetup: 'story/multipleboxes/Setup.yaml',
  'storyText': [
    'story/multipleboxes/Story.yaml'
  ]
}

const RenJSGame = new RenJS.game(globalConfig)
RenJSGame.launch()
