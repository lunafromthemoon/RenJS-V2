## [2.9.1](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.9.0...v2.9.1) (2022-06-01)


### Bug Fixes

* pauses bug ([f99925e](https://github.com/lunafromthemoon/RenJS-V2/commit/f99925ea434f4907ab9ebeb06c585974234cb3ee))

# [2.9.0](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.8.0...v2.9.0) (2022-06-01)


### Features

* dramatic pauses ([cb199fa](https://github.com/lunafromthemoon/RenJS-V2/commit/cb199fa6b87d9aac057abe050eb9ff7d1b235e67))

# [2.8.0](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.7.5...v2.8.0) (2022-05-22)


### Features

* add label buttons ([0be8b62](https://github.com/lunafromthemoon/RenJS-V2/commit/0be8b6230ce9d7ef86b7fe43fab60e4147c16608))

## [2.7.5](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.7.4...v2.7.5) (2022-04-06)


### Bug Fixes

* credits text against bg color contrast ([4592c13](https://github.com/lunafromthemoon/RenJS-V2/commit/4592c1380a51168141c6f1846ea5aca16bcc61ac))
* make `backgroundColor` optional ([9607f74](https://github.com/lunafromthemoon/RenJS-V2/commit/9607f74d86ea8b8174bcaa366baa0afc502e56bf))
* respect `backgroundColor` ([6bb8894](https://github.com/lunafromthemoon/RenJS-V2/commit/6bb88949de90991988f375f99a7a7048bbc28f79))

## [2.7.4](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.7.3...v2.7.4) (2022-04-06)


### Bug Fixes

* tweens with `time: 0` treated as `time: 1000` ([4248037](https://github.com/lunafromthemoon/RenJS-V2/commit/42480374401732d92cfbd848bbea698d90a78a17))

## [2.7.3](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.7.2...v2.7.3) (2022-04-06)


### Bug Fixes

* incorrect `types` path ([223f60b](https://github.com/lunafromthemoon/RenJS-V2/commit/223f60b172400d6d63ca49c0e9472a95f759bb98))
* log unknown effects to console ([8eca368](https://github.com/lunafromthemoon/RenJS-V2/commit/8eca3682cd95b60b05bb3cb13cea5f25104504e8))

## [2.7.2](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.7.1...v2.7.2) (2022-02-15)


### Bug Fixes

* logChoices was not being used ([d5c541f](https://github.com/lunafromthemoon/RenJS-V2/commit/d5c541fa221f85a090d416978be097fc7f21c7e0))

## [2.7.1](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.7.0...v2.7.1) (2022-01-08)


### Bug Fixes

* forgot to actually push the changes??? ([173c952](https://github.com/lunafromthemoon/RenJS-V2/commit/173c9527065b044f4903931be4d4fbbf72b4dc21))

# [2.7.0](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.6.3...v2.7.0) (2022-01-08)


### Features

* story log ([a39aece](https://github.com/lunafromthemoon/RenJS-V2/commit/a39aecea08e06fa5a7aa99a772e8e3c032ec958c))

## [2.6.3](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.6.2...v2.6.3) (2022-01-07)


### Bug Fixes

* sfx is now sent to the message box, text sfx is skipped in new line character, indexed elements are now properly indexed by id, two new plugin handlers ([c12b278](https://github.com/lunafromthemoon/RenJS-V2/commit/c12b278e3e2703fb153431b26b6fb921e29d1b30))
* Solve boot issues ([d774c9e](https://github.com/lunafromthemoon/RenJS-V2/commit/d774c9e0c7d4604734893a284cc3f681bfc92865))

## [2.6.2](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.6.1...v2.6.2) (2021-12-24)


### Bug Fixes

* lazyloading failed when whole action key included parts of reserved words like 'if' or 'choice', added also the cgs used by visual choices ([1fd68b2](https://github.com/lunafromthemoon/RenJS-V2/commit/1fd68b2bfbf616561ed480d6980eb3bca1d493cf))

## [2.6.1](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.6.0...v2.6.1) (2021-12-12)


### Bug Fixes

* **a11y:** escape html before tokenizing it for accessible label ([663e9e3](https://github.com/lunafromthemoon/RenJS-V2/commit/663e9e30b183c854b30ddc22af56db659139a96e))

# [2.6.0](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.5.0...v2.6.0) (2021-12-05)


### Features

* **a11y:** allow accessible labels to be overridden from a yaml file ([77fe35b](https://github.com/lunafromthemoon/RenJS-V2/commit/77fe35b03ec5917a4f30f6c37033c79b79a74913))
* **a11y:** make rolling credits effect text accessible ([2a62911](https://github.com/lunafromthemoon/RenJS-V2/commit/2a62911e8eedd31949ba2060f47f0fbabfbaae1a))

# [2.5.0](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.4.0...v2.5.0) (2021-12-05)


### Bug Fixes

* **a11y:** hide canvas from accessibility tree ([511b100](https://github.com/lunafromthemoon/RenJS-V2/commit/511b100277a32691dc0642fcd7f2d5e61a8a5b62))
* **a11y:** move "return" on saveload below save/load buttons ([0999ce6](https://github.com/lunafromthemoon/RenJS-V2/commit/0999ce6801a167cbdafc12e0a7781768e10a2fba))
* **a11y:** reorder HUD menu buttons to be settings > saveload > auto > skip ([eac1ac7](https://github.com/lunafromthemoon/RenJS-V2/commit/eac1ac7400974c5082432edd4c0f7d897776a89b))


### Features

* **a11y:** make choices accessible ([23aef71](https://github.com/lunafromthemoon/RenJS-V2/commit/23aef7119e8dee9aa03817c47238b16e787f82c0))
* **a11y:** make menu buttons accessible ([2350aad](https://github.com/lunafromthemoon/RenJS-V2/commit/2350aadd2b1dd4a00a6652b9952829c4d2b8c96f))
* **a11y:** make message box text accessible ([724a2e3](https://github.com/lunafromthemoon/RenJS-V2/commit/724a2e3178d480e4e2fd5bcf8bb0c91cab27ef06))
* **a11y:** make name text accessible ([ab48c89](https://github.com/lunafromthemoon/RenJS-V2/commit/ab48c89bd3960c6ded7b9adfaaa96c0a3db7172a))
* **a11y:** make sliders accessible ([fac4ca8](https://github.com/lunafromthemoon/RenJS-V2/commit/fac4ca875085ff6919f70dd47b112c80bb3c066e))
* **a11y:** make visual choices accessible ([9569fd0](https://github.com/lunafromthemoon/RenJS-V2/commit/9569fd02acb949b9958bd10bd1260f1c4f03f8ff))
* add accessibility layer to game ([02d7636](https://github.com/lunafromthemoon/RenJS-V2/commit/02d7636964862cf77567ca96b1410403edde3226))
* support nested text styles ([540c8d5](https://github.com/lunafromthemoon/RenJS-V2/commit/540c8d5143d8eb2231d2c115581af2eb0f2b1326))

# [2.4.0](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.3.2...v2.4.0) (2021-12-05)


### Features

* update `js-yaml` ([996bd7d](https://github.com/lunafromthemoon/RenJS-V2/commit/996bd7d231876e6dcc5deae227699b3fb97383e7)), closes [/github.com/nodeca/js-yaml/blob/master/CHANGELOG.md#400---2021-01-03](https://github.com//github.com/nodeca/js-yaml/blob/master/CHANGELOG.md/issues/400---2021-01-03)
* update bundler ([2c6864b](https://github.com/lunafromthemoon/RenJS-V2/commit/2c6864b2bee18cee7ffc7722f60c37289eb94056))

## [2.3.2](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.3.1...v2.3.2) (2021-11-23)


### Bug Fixes

* delint ([d3fd082](https://github.com/lunafromthemoon/RenJS-V2/commit/d3fd082246442fe7f9bfb4bee799a7079a157f23))

## [2.3.1](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.3.0...v2.3.1) (2021-11-14)

 
### Bug Fixes

* send body to plugins, text input example ([264731f](https://github.com/lunafromthemoon/RenJS-V2/commit/264731ff5489485948688b5d11c383194859eabd))

# [2.3.0](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.2.4...v2.3.0) (2021-11-11)


### Features

* Message Boxes with portraits ([cea7542](https://github.com/lunafromthemoon/RenJS-V2/commit/cea75420d42f3c1bcdd7b2174e53c61628e06b31))

## [2.2.4](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.2.3...v2.2.4) (2021-11-10)


### Bug Fixes

* `RJSGUI.menus` being incorrectly initialized due to typescript error ([87cf63c](https://github.com/lunafromthemoon/RenJS-V2/commit/87cf63c20258fc5ac46f3c017196ef2cdc9aa6e4))
* fix missing radix when parsing thumbnail properties ([7f3c29c](https://github.com/lunafromthemoon/RenJS-V2/commit/7f3c29cbc041062738bda0f92a3f2316f7414a7b))

## [2.2.3](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.2.2...v2.2.3) (2021-11-09)


### Bug Fixes

* Safely check actor type in actions, ignore asset loader when no assets ([559ba51](https://github.com/lunafromthemoon/RenJS-V2/commit/559ba5107019088e3e123c32cdde488f44ca852c))

## [2.2.2](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.2.1...v2.2.2) (2021-11-08)


### Bug Fixes

* lazyloading bug with new self parsing actions ([721bef9](https://github.com/lunafromthemoon/RenJS-V2/commit/721bef9338bf32cfa35d6b0e3c355456038b6598))

## [2.2.1](https://github.com/lunafromthemoon/RenJS-V2/compare/v2.2.0...v2.2.1) (2021-11-06)


## 2.2.1

* Choices can now have empty options. When the option is empty, the game will simply continue after the choice.
* Fixed crash when doing wait for click
* Fixed crash when hiding a background that didn't exist
* Fixed text in namebox/choices showing weird for a few frames
* Fixed image flicker bug
* Fixed spritesheet animated ctc not working
* Actions now know how to parse and execute themselves

## 2.1.1

* Added RenJS version string: `RenJSGame.renjsversion`
* Character manager and character entity completely revamped
* Character setup property `speechColour` will soon be removed, use `color` instead

## 2.1.0

* New manual GUI.yaml format
* New plugin handle `onAction`
* Debug mode
* Automatic breaklines
* Hide all CGs on screen


## 2.0.0
