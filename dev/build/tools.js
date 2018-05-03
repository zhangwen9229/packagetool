'use strict'
const rm = require('rimraf'),
    chalk = require('chalk'),
    config = require('../config'),
    fs = require('fs'),
    path = require('path'),
    async = require("async"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    view_path = path.join(config.common.src, config.common.view),
    dist_view_path = path.join(config.common.dist_view, config.common.view),
    HeadJavascriptInjectPlugin = require('./headJavascriptInjectPlugin');

let matchs = [],
    files = {},
    arrhtmlPlugins = [];

module.exports.htmlPlugins = arrhtmlPlugins;

const getEntrys = () => {
    const jsPath = path.resolve(__dirname, view_path);
    const srcViewPath = path.resolve(__dirname, view_path);
    loopReadDir(jsPath, (itemPath) => {
            matchs = itemPath.match(/(.+)index\.js$/)
            if (matchs) {
                files[getChunk(srcViewPath, matchs, true)] = itemPath;
                return;
            }

            matchs = itemPath.match(/(.+)\.(html|php|jsp|tpl)$/);
            if (matchs) {
                generateHtmlWebpackPlugin(srcViewPath, itemPath);
            }
        })

    return files
}

/**
 * 
 * @param {string} srcViewPath 视图源目录路径
 * @param {array} matchs 正则匹配的chunk文件 JS/HTML
 * @param {boolean} isJs 是否Js文件
 */
const getChunk = (srcViewPath, matchs, isJs) => {
    const m0 = matchs[0],
        m1 = matchs[1]
    const fileName = path.basename(m0, path.extname(m0));
    if (isJs) {
        return path.relative(srcViewPath, `${m1}/${fileName}`);
    } else {
        return path.relative(srcViewPath, m1);
    }
}

/**
 * 递归查找目录中的文件
 * @param {string} dirOrFile 目录或者文件
 */
const loopReadDir = (dirOrFile, callback) => {
    const dirs = fs.readdirSync(dirOrFile)
    dirs.forEach((item) => {
        let itemPath = path.join(dirOrFile, item)
        const stat = fs.lstatSync(itemPath);
        if (stat.isDirectory()) {
            loopReadDir(itemPath, callback)
        } else {
            callback(itemPath)
        }
    })
}

/**
 * 
 * @param {string} srcViewPath 视图源目录路径
 * @param {string} itemPath html 文件路径
 */
const generateHtmlWebpackPlugin = (srcViewPath, itemPath) => {
    const relativeHtmlPath = path.relative(srcViewPath, itemPath),
        absoluteHtmlPath = path.resolve(__dirname, path.join(dist_view_path, relativeHtmlPath)),
        htmlPluginOption = {
            filename: absoluteHtmlPath,
            template: itemPath,
            inject: false,
            // favicon: 'src/images/favicon.png'
        }
    if (itemPath.match(/(.+)index\.html$/)) {
        htmlPluginOption.chunks = [getChunk(srcViewPath, matchs), 'vendor'];
        htmlPluginOption.inject = true;
    }
    if (process.env.NODE_ENV === 'production') {
        htmlPluginOption.minify = {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        };
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        htmlPluginOption.chunksSortMode = 'dependency';
    }

    const htmlPlugin = new HtmlWebpackPlugin(htmlPluginOption)
    const headJavascriptInjectPlugin = new HeadJavascriptInjectPlugin({
        headJavascript: readHeadScripts()
    })

    arrhtmlPlugins.push(htmlPlugin)
    arrhtmlPlugins.push(headJavascriptInjectPlugin)
}

/**
 * 删除旧的打包文件
 * @param {function} callback 
 */
const removeOldFiles = (callback) => {
    const arrDir = [path.resolve(__dirname, dist_view_path), config.common.assetsRoot];
    async.series(arrDir.map(function(dir) {
        return function(done) {
            console.log('cleaning: ', chalk.yellow(dir));
            rm(dir + '/*', done);
        }
    }), callback);
}

/**
 * 读取插入头部的脚本
 */
const readHeadScripts = () => {
    const arrHeadJs = [];
    config.common.headerChunks.forEach((item, index) => {
        const headJavascript = fs.readFileSync(item, { encoding: 'utf8' });
        arrHeadJs.push(`<script>${headJavascript}</script>`)
    })
    return arrHeadJs.join('\n');
}



module.exports.removeOldFiles = removeOldFiles;
module.exports.getEntrys = getEntrys;