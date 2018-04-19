'use strict'
const config = require('../config'),
    fs = require('fs'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin')

let matchs = [],
    files = {},
    arrhtmlPlugins = []

module.exports.htmlPlugins = arrhtmlPlugins;

const getEntrys = () => {
    const jsPath = path.resolve(__dirname, '../src/view')
    loopReadDir(jsPath, (itemPath) => {
        const srcViewPath = path.resolve(__dirname, '../src/view/');
        matchs = itemPath.match(/(.+)index\.js$/)
        if (matchs) {
            files[getChunk(srcViewPath, matchs, true)] = itemPath
            return
        }

        matchs = itemPath.match(/(.+)\.html$/)
        if (matchs) {
            // console.log(itemPath)
            const relativeHtmlPath = path.relative(srcViewPath, itemPath)
            const absoluteHtmlPath = path.resolve(__dirname, '../dist/view', relativeHtmlPath)
            const htmlPluginOption = {
                filename: absoluteHtmlPath,
                template: itemPath,
                inject: false
            }
            if(itemPath.match(/(.+)index\.html$/))
            {
                // console.log(getChunk(srcViewPath, matchs))
                htmlPluginOption.chunks = [getChunk(srcViewPath, matchs)]
                htmlPluginOption.inject= true
            }

            const htmlPlugin = new HtmlWebpackPlugin(htmlPluginOption)

            arrhtmlPlugins.push(htmlPlugin)
        }
    })
    return files
}

const getChunk = (srcViewPath, matchs, isJs) => {
    const m0 = matchs[0],
        m1 = matchs[1]
    const fileName = path.basename(m0, path.extname(m0))
    // console.log(path.relative(srcViewPath, m1))
    if (isJs) {
        return path.relative(srcViewPath, `${m1}/${fileName}`)
    } else {
        return path.relative(srcViewPath, m1);
    }

}

/**
 * 
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


// const generateHtmlWebpackPlugin() {
//     const option = {
//         filename: path.resolve(__dirname, '../view/bid/list/index.html'),
//         template: path.resolve(__dirname, '../src/view/bid/list/index.html'),
//         chunks: ['bid/list/index'],
//         inject: true
//     }

//     return new HtmlWebpackPlugin({

//     })
// }


// getEntrys();
module.exports.getEntrys = getEntrys;