'use strict'
const utils = require('./utils'),
    webpack = require('webpack'),
    config = require('../config'),
    merge = require('webpack-merge'),
    path = require('path'),
    baseWebpackConfig = require('./webpack.base.conf'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    tools = require('./tools'),
    SimpleProgressPlugin = require('webpack-simple-progress-plugin');

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        // new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            // filename: utils.assetsPath('style/[name].[hash:8].css'),
            filename: utils.assetsPath('style/[name].css'),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            allChunks: true,
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: config.dev.port,
            server: !!config.dev.proxyUrl ? null : {
                baseDir: [config.common.assetsRoot]
            },
            proxy: config.dev.proxyUrl || null,
            open: config.dev.autoOpenBrowser
        }, {
            reload: false
        }),
        new SimpleProgressPlugin()
    ]
})

module.exports = devWebpackConfig;