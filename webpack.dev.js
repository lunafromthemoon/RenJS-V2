const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: "inline-source-map",
    plugins: [
        new CopyPlugin({
            patterns: [
                // { from: path.resolve(__dirname, 'dev-only/assets'), to: 'assets' },
                // { from: path.resolve(__dirname, 'dev-only/story'), to: 'story' },
                // { from: path.resolve(__dirname, 'dev-only/GUI.yaml'), to: '' },
                // { from: path.resolve(__dirname, 'dev-only/index.html'), to: '' },
                // { from: path.resolve(__dirname, 'dev-only/config.js'), to: '' },
                { from: path.resolve(__dirname, 'dev-only'), to: '' }
            ]
        }),
    ],
})
