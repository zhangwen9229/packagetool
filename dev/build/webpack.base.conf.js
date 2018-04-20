'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const AssetsPlugin = require('assets-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const tools = require('./tools')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
// console.log(process.env.NODE_ENV)
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: tools.getEntrys(),
    output: {
        path: config.build.assetsRoot,
        // filename: '[name].[hash:8].js',
        // chunkFilename: "bundle/[name].[chunkhash:8].js",
        filename: '[name].js',
        chunkFilename: "bundle/[name].js",
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
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
                    loader: 'html-loader',
                    // options: {
                    //     attrs: [':src']
                    // }
                }
            }
        ]
    },
    plugins: [

        // new AssetsPlugin({
        //     filename: 'map.json',
        //     prettyPrint: true,
        //     includeManifest: false
        // })
        new ManifestPlugin()
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