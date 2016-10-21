var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'https://localhost:3000/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].[hash].map',
            exclude: [
                'vendor.js',
                'polyfills.js'
            ]
        }),

        new ExtractTextPlugin('[name].css')
    ],

    devServer: {
        https: true,
        historyApiFallback: true,
        stats: 'minimal',
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        outputPath: helpers.root('dist')
    }
});
