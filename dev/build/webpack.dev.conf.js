'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const tools = require('./tools')

// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// const portfinder = require('portfinder')

// const HOST = process.env.HOST
// const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, extract: true, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
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
        // https://github.com/ampedandwired/html-webpack-plugin
        // new HtmlWebpackPlugin({
        //     filename: path.resolve(__dirname, '../dist/view/bid/list/index.html'),
        //     template: path.resolve(__dirname, '../src/view/bid/list/index.html'),
        //     chunks: ['bid/list/index'],
        //     inject: true
        // }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../src/static'),
            to: config.dev.assetsSubDirectory + '/static/',
            ignore: ['.*']
        }]),
        new BrowserSyncPlugin({
            // browse to http://localhost:3000/ during development,
            // ./public directory is being served
            host: 'localhost',
            port: 8081,
            server: { baseDir: [path.resolve(__dirname, '../dist/')] },
            // proxy: 'http://localhost:8080/',
            open: true
        }, {
            reload: false
        })
    ].concat(tools.htmlPlugins)
})

module.exports = devWebpackConfig;

// module.exports = new Promise((resolve, reject) => {
//     portfinder.basePort = process.env.PORT || config.dev.port
//     portfinder.getPort((err, port) => {
//         if (err) {
//             reject(err)
//         } else {
//             // publish the new Port, necessary for e2e tests
//             process.env.PORT = port
//                 // add port to devServer config
//             devWebpackConfig.devServer.port = port

//             // Add FriendlyErrorsPlugin
//             devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//                 compilationSuccessInfo: {
//                     messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//                 },
//                 onErrors: config.dev.notifyOnErrors ?
//                     utils.createNotifierCallback() : undefined
//             }))

//             resolve(devWebpackConfig)
//         }
//     })
// })