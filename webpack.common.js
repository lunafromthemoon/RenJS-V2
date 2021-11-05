const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
    target: "web",
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'RenJS',
        libraryTarget: "var",
        globalObject: "this"
    },
    module: {
        rules: [
            { test: /\.ts?$/, loader: 'ts-loader', exclude: /node_modules/ },
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
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};
