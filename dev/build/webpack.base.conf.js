'use strict'
const path = require('path'),
    utils = require('./utils'),
    config = require('../config'),
    vueLoaderConfig = require('./vue-loader.conf'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    tools = require('./tools');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: tools.getEntrys(),
    output: {
        path: config.common.assetsRoot,
        filename: config.common.assetsSubDirectory + '/js/[name].js',
        chunkFilename: config.common.assetsSubDirectory + '/bundle/[name].js',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        },
        modules: [
            './src/', 
            "node_modules"
        ]
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [resolve('src')],
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            }
        ]
    },
    plugins: [
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, path.join(config.common.src, config.common.static)),
            to: config.common.static,
            ignore: ['.*']
        }]),
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}