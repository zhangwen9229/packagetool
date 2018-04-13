'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const AssetsPlugin = require('assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const tools = require('./tools')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
console.log(process.env.NODE_ENV)
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: tools.getEntrys(),
    output: {
        path: config.build.assetsRoot,
        filename: '[name].[hash:8].js',
        chunkFilename: "bundle/[name].[chunkhash:8].js",
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
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
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
                options: {
                    plugins: ['transform-runtime','transform-es3-property-literals'],
                    presets: ['es2015-loose']
                }
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
        ]
        // .concat(utils.styleLoaders({
        //     sourceMap: config.dev.cssSourceMap,
        //     extract: true,
        //     usePostCSS: true
        // }))
    },
    plugins: [
        // new ExtractTextPlugin({
        //     filename: utils.assetsPath('style/[name].[hash:8].css'),
        //     // Setting the following option to `false` will not extract CSS from codesplit chunks.
        //     // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
        //     // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
        //     // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
        //     allChunks: true,
        // }),
        new AssetsPlugin({
            filename: 'map.json',
            prettyPrint: true,
            includeManifest: false
        })
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