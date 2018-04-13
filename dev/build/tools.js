'use strict'
const config = require('../config'),
    fs = require('fs'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin')

let matchs = [],
    files = {}

const getEntrys = () => {
    const jsPath = path.resolve(__dirname, '../src/view')
    files = loopReadDir(jsPath)
        // console.log(files)
    return files
}

/**
 * 
 * @param {string} dirOrFile 目录或者文件
 */
const loopReadDir = (dirOrFile) => {
    const dirs = fs.readdirSync(dirOrFile)
    dirs.forEach((item) => {
        let itemPath = path.join(dirOrFile, item)
        const stat = fs.lstatSync(itemPath);
        if (stat.isDirectory()) {
            return loopReadDir(itemPath)
        } else {
            matchs = itemPath.match(/(.+)index\.js$/)
            if (matchs) {
                files[path.relative(path.resolve(__dirname, '../src/view/'), matchs[1] + '/index')] = itemPath

            }
        }
    })
    return files
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
