const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = merge(common, {
    entry: {
        index: path.join(__dirname, 'src/to-migrate/RenJSBootstrap')
    },
    mode: 'development',
    devtool: "inline-source-map",
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/dev-only/assets'), to: 'assets' },
                { from: path.resolve(__dirname, 'src/dev-only/story'), to: 'story' },
                { from: path.resolve(__dirname, 'src/dev-only/GUI.yaml'), to: '' },
                { from: path.resolve(__dirname, 'src/dev-only/index.html'), to: '' }
            ]
        }),
    ],
    module: {
        rules: [
            { test: /\.ts?$/, loader: 'ts-loader', exclude: '/node_modules/' },
            // { test: /\.js$/, loader: 'babel-loader', include: path.join(__dirname, 'src') },
            { test: /pixi\.js/, loader: 'expose-loader', options: { exposes: ['PIXI'] } },
            { test: /phaser-split\.js$/, loader: 'expose-loader', options: { exposes: ['Phaser'] } },
            { test: /p2\.js/, loader: 'expose-loader', options: { exposes: ['p2'] } }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            'phaser-ce': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
})
