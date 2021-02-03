"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../states/utils");
var RJSLoadingScreen_1 = __importDefault(require("../components/RJSLoadingScreen"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var RJSAssetLoader = /** @class */ (function () {
    function RJSAssetLoader(game) {
        this.game = game;
        this.assetsPerScene = {};
        this.episodes = [];
        this.loadedAssets = {};
        this.loadedEpisodes = {};
        this.loading = false;
        if (this.game.setup.lazyloading.findAssets) {
            // get each scene asset
            for (var scene in this.game.story) {
                var actions = this.game.story[scene];
                for (var i = 0; i < actions.length; i++) {
                    var action = this.game.managers.story.parseAction(actions[i]);
                    if (action.mainAction == "show" || action.mainAction == "play") {
                        if (!this.assetsPerScene[scene])
                            this.assetsPerScene[scene] = {};
                        this.assetsPerScene[scene][action.actor] = action.actorType;
                    }
                }
            }
            var assetsText = js_yaml_1.default.dump(this.assetsPerScene);
            console.log("COPY THIS TEXT INTO THE LAZY LOADING SETUP");
            console.log("assetsPerScene:");
            console.log(assetsText);
        }
        else {
            this.assetsPerScene = this.game.setup.lazyloading.assetsPerScene;
            this.episodes = this.game.setup.lazyloading.episodes;
            if (!this.episodes)
                this.episodes = [];
        }
        if ()
            ;
    }
    RJSAssetLoader.prototype.getEpisode = function (sceneName) {
        for (var i = 0; i < this.episodes.length; i++) {
            if (this.episodes[i].includes(sceneName)) {
                return i;
            }
        }
        return -1;
    };
    RJSAssetLoader.prototype.loadScene = function (sceneName) {
        return __awaiter(this, void 0, void 0, function () {
            var episodeIdx, toLoad;
            return __generator(this, function (_a) {
                episodeIdx = this.getEpisode(sceneName);
                if (episodeIdx != -1) {
                    return [2 /*return*/, this.loadEpisode(episodeIdx, this.game.setup.lazyloading.backgroundLoading)];
                }
                toLoad = this.assetsPerScene[sceneName];
                return [2 /*return*/, this.loadAssets(toLoad)];
            });
        });
    };
    RJSAssetLoader.prototype.loadEpisodeInBackground = function (episodeIdx) {
        if (episodeIdx <= this.episodes.length - 1) {
            console.log("Loading episode " + episodeIdx + " in background");
            this.backgroundLoading = this.loadEpisode(episodeIdx, false, true);
        }
    };
    RJSAssetLoader.prototype.loadEpisode = function (episodeIdx, loadNextAfter, background) {
        return __awaiter(this, void 0, void 0, function () {
            var toLoad, i, promise;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.loadedEpisodes[episodeIdx]) {
                    console.log("Episode " + episodeIdx + " already loaded.");
                    // this episode was already loaded, but we try to load the next one anyway
                    if (loadNextAfter) {
                        this.loadEpisodeInBackground(episodeIdx + 1);
                    }
                    return [2 /*return*/];
                }
                console.log("Loading episode " + episodeIdx);
                this.loadedEpisodes[episodeIdx] = true;
                toLoad = {};
                for (i = 0; i < this.episodes[episodeIdx].length; i++) {
                    // add assets for each scene in the episode
                    toLoad = __assign(__assign({}, toLoad), this.assetsPerScene[this.episodes[episodeIdx][i]]);
                }
                promise = this.loadAssets(toLoad, background);
                if (loadNextAfter) {
                    promise.then(function () {
                        // after loading the current episode, we set to load the next one in the background
                        _this.loadEpisodeInBackground(episodeIdx + 1);
                    });
                }
                return [2 /*return*/, promise];
            });
        });
    };
    RJSAssetLoader.prototype.loadAssets = function (assets, background) {
        return __awaiter(this, void 0, void 0, function () {
            var asset, audioList, asset, assetType;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        for (asset in this.loadedAssets) {
                            // remove assets already loaded
                            delete assets[asset];
                        }
                        if (this.game.config.debugMode) {
                            // console.log("Loading assets:");
                            // console.log(assets)
                        }
                        if (Object.keys(assets).length == 0) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        // set loading screen
                        if (!background && this.game.setup.lazyloading.loadingScreen) {
                            this.loadingScreen = new RJSLoadingScreen_1.default(this.game);
                        }
                        if (!this.backgroundLoading) return [3 /*break*/, 2];
                        // we want to start loading new assets, but background loading still working
                        return [4 /*yield*/, this.backgroundLoading];
                    case 1:
                        // we want to start loading new assets, but background loading still working
                        _a.sent();
                        this.backgroundLoading = null;
                        _a.label = 2;
                    case 2:
                        audioList = [];
                        // load assets on the fly
                        for (asset in assets) {
                            assetType = assets[asset];
                            switch (assetType) {
                                case "backgrounds":
                                    utils_1.preloadBackground(asset, this.game);
                                    break;
                                case "cgs":
                                    utils_1.preloadCGS(asset, this.game);
                                    break;
                                case "characters":
                                    utils_1.preloadCharacter(asset, this.game);
                                    break;
                                case "music":
                                    audioList.push(asset);
                                    utils_1.preloadAudio(asset, "music", this.game);
                                    break;
                                case "sfx":
                                    audioList.push(asset);
                                    utils_1.preloadAudio(asset, "sfx", this.game);
                                    break;
                                default:
                                    utils_1.preloadExtra(asset, assetType, this.game);
                            }
                        }
                        return [2 /*return*/, new Promise(function (resolve) {
                                _this.game.load.onLoadComplete.addOnce(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                // teardown loading screen
                                                this.loading = false;
                                                this.loadedAssets = __assign(__assign({}, this.loadedAssets), assets);
                                                if (!(audioList.length > 0)) return [3 /*break*/, 2];
                                                // decode new audio assets
                                                return [4 /*yield*/, this.game.managers.audio.decodeAudio(audioList)];
                                            case 1:
                                                // decode new audio assets
                                                _a.sent();
                                                _a.label = 2;
                                            case 2:
                                                if (this.loadingScreen) {
                                                    this.loadingScreen.destroy(this.game);
                                                    this.loadingScreen = null;
                                                }
                                                if (this.backgroundLoading) {
                                                    // this was background loading
                                                    this.backgroundLoading = null;
                                                }
                                                if (this.game.config.debugMode) {
                                                    console.log("All assets loaded.");
                                                }
                                                resolve();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, _this);
                                _this.loading = true;
                                if (_this.loadingScreen) {
                                    _this.loadingScreen.setLoadingBar(_this.game);
                                }
                                _this.game.load.start();
                            })];
                }
            });
        });
    };
    return RJSAssetLoader;
}());
exports.default = RJSAssetLoader;
//# sourceMappingURL=RJSAssetLoader.js.map