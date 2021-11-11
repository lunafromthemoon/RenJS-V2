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
