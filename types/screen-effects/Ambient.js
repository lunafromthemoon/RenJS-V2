"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ambient = /** @class */ (function () {
    function Ambient(game) {
        this.clearFunctions = [];
        this.current = [];
        this.game = game;
        this.audioManager = game.managers.audio;
    }
    Ambient.prototype.start = function (name) {
        // start ambient from here or from plugin
        this.current.push(name);
        if (this[name]) {
            this[name]();
        }
        else if (this.game.pluginsRJS[name]) {
            this.game.pluginsRJS[name].onCall();
        }
    };
    Ambient.prototype.set = function (ambients) {
        if (!ambients)
            return;
        // set ambients after loading game
        for (var i = 0; i < ambients.length; i++) {
            this.start(ambients[i]);
        }
    };
    Ambient.prototype.addEmitter = function (options, params) {
        var emitter = this.game.add.emitter(this.game.world.centerX, -32, options.maxParticles);
        emitter.width = this.game.world.width * 1.5;
        emitter.makeParticles(options.sprite, options.frames);
        if (options.scale) {
            emitter.maxParticleScale = options.scale[1];
            emitter.minParticleScale = options.scale[0];
        }
        if (options.speed && options.speed.y) {
            emitter.setYSpeed(options.speed.y[0], options.speed.y[1]);
        }
        if (options.speed && options.speed.x) {
            emitter.setXSpeed(options.speed.x[0], options.speed.x[1]);
        }
        emitter.gravity = options.gravity ? options.gravity : 0;
        if (options.rotation) {
            emitter.minRotation = options.rotation[0];
            emitter.maxRotation = options.rotation[1];
        }
        emitter.start.apply(emitter, params);
        return emitter;
    };
    Ambient.prototype.destroyEmitters = function (emitters, maxLifespan) {
        emitters.forEach(function (emitter) { return emitter.on = false; });
        setTimeout(function () {
            emitters.forEach(function (emitter) { return emitter.destroy(); });
            emitters = [];
        }, maxLifespan * 2);
    };
    Ambient.prototype.BGS = function (sound) {
        this.audioManager.play(sound, 'bgs', true, null, 'FADE');
    };
    Ambient.prototype.CLEAR = function () {
        this.clearFunctions.forEach(function (func) { return func(); });
        this.clearFunctions = [];
        this.current = [];
    };
    Ambient.prototype.RAIN = function () {
        var _this = this;
        this.audioManager.play('rainBGS', 'bgs', true, null, 'FADE');
        var maxLifespan = 1600;
        var emitter = this.addEmitter({
            maxParticles: 400,
            sprite: 'rain',
            frames: [0],
            scale: [0.1, 0.5],
            speed: { y: [300, 500], x: [-5, 5] },
            rotation: [0, 0]
        }, [false, maxLifespan, 5, 0]);
        this.clearFunctions.push(function () {
            _this.destroyEmitters([emitter], maxLifespan);
            _this.audioManager.stop('bgs', 'FADE');
        });
    };
    Ambient.prototype.SAKURA = function () {
        var _this = this;
        var maxLifespan = 6000;
        var e1 = this.addEmitter({
            maxParticles: 200,
            sprite: 'sakura',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2, 0.6],
            speed: { y: [20, 100], x: [120, 150] },
            rotation: [0, 40]
        }, [false, maxLifespan, 20]);
        var e2 = this.addEmitter({
            maxParticles: 150,
            sprite: 'sakura',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8, 1.2],
            speed: { y: [50, 150], x: [100, 120] },
            rotation: [0, 40]
        }, [false, maxLifespan, 20]);
        this.clearFunctions.push(function () {
            _this.destroyEmitters([e1, e2], maxLifespan);
        });
    };
    Ambient.prototype.SNOW = function () {
        var _this = this;
        var maxLifespan = 6000;
        var e1 = this.addEmitter({
            maxParticles: 200,
            sprite: 'snowflakes',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.2, 0.6],
            speed: { y: [20, 100] },
            rotation: [0, 40],
        }, [false, 6000, 20]);
        var e2 = this.addEmitter({
            maxParticles: 150,
            sprite: 'snowflakes',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.8, 1.2],
            speed: { y: [50, 150] },
            rotation: [0, 40],
        }, [false, 5000, 40]);
        var e3 = this.addEmitter({
            maxParticles: 150,
            sprite: 'snowflakes_large',
            frames: [0, 1, 2, 3, 4, 5],
            scale: [0.5, 1],
            speed: { y: [100, 200] },
            rotation: [0, 40],
        }, [false, 4000, 1000]);
        this.clearFunctions.push(function () {
            _this.destroyEmitters([e1, e2, e3], maxLifespan);
        });
    };
    return Ambient;
}());
exports.default = Ambient;
//# sourceMappingURL=Ambient.js.map