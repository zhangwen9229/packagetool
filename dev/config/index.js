'use strict'
const path = require('path')

module.exports = {
    common: {
        // Paths
        src: '../src',
        view: 'view', //视图目录名
        dist_view: '../dist/', //若不是用后端代理，该目录路径需保持与assetsRoot相同
        static: 'static', //静态文件，直接拷贝，不打包
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: '' //assets
    },
    dev: {
        host: 'localhost',
        port: 8081,
        proxyUrl: '', //http://localhost:8080/
        autoOpenBrowser: false,
        assetsPublicPath: '/',
        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map', //'source-map',
        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,
        cssSourceMap: true
    },

    build: {
        //Source Maps
        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',
        assetsPublicPath: '/',//cdn: //qb.com
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}