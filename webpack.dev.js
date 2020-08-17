const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = merge(common, {
    entry: {
        index: path.join(__dirname, 'src/dev-only/RenJS/RenJSBootstrap')
    },
    mode: 'development',
    devtool: "inline-source-map",
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/dev-only'), to: '' }
            ]
        }),
        new webpack.ProvidePlugin({
           PIXI: pixi,
           p2,
           Phaser: phaser,
        })
    ]
})
