const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path');

var PACKAGE = require('./package.json');
var version = PACKAGE.version;

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: `[name]-${version}.js`,
        path: path.resolve(__dirname, 'dist'),
        library: 'RenJS',
        libraryTarget: "var",
        globalObject: "this"
    }
})
