'use strict'
require('./check-versions')();
process.env.NODE_ENV = 'development'
const path = require('path'),
    chalk = require('chalk'),
    webpack = require('webpack'),
    config = require('../config'),
    webpackConfig = require('./webpack.dev.conf'),
    tools = require('./tools'),
    bs = require('browser-sync').get('bs-webpack-plugin');
let lastStatsJson;

tools.removeOldFiles(err => {
    if (err) throw err
    const compiler = webpack(webpackConfig);
    let changedFiles = [];
    //通过watch-run检查修改文件
    compiler.plugin("watch-run", (watching, done) => {
        const changedTimes = watching.watchFileSystem.watcher.mtimes;
        changedFiles = Object.keys(changedTimes)
            .map(file => `${file}`);
        done();
    });

    compiler.watch({
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
    }, function(err, stats) {
        if (err) throw err
        const jsonStats = stats.toJson();
        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            console.log(chalk.red(jsonStats.errors))
            bs.notify(`<div style=' 
                        width: 100%;
                        height: 100%;
                        word-break: break-word;
                        pointer-events: all;overflow:auto;
                        position: fixed;
                        left: 0;
                        top: 0;
                        background: #000;'>${JSON.stringify(jsonStats.errors)}</div>`, 200000);
            return;
        }

        if (jsonStats.warnings.length > 0) {
            console.log(chalk.red(jsonStats.warnings))
        }
        if (changedFiles.length) {
            console.log(chalk.green("New build triggered"));
            console.log(chalk.green("  files changed:"), chalk.yellow(changedFiles))
            let isHasJsOrHtmlChanged = false;
            const arrCssBasename = [],
                arrMatchs = [];
            changedFiles.forEach((value, index) => {
                //判断修改文件中是否有非css类型文件
                const matchs = value.match(/(?!(\.css|\.scss|\.sass|\.less))(\..*)$/g)
                if (matchs && matchs.length > 0) {
                    //有非css文件被修改
                    arrMatchs.push(matchs[0])
                    isHasJsOrHtmlChanged = true;
                    return false;
                } else {
                    arrCssBasename.push(path.basename(value).replace(path.extname(value), '.css'));
                }
            });

            if (isHasJsOrHtmlChanged) {
                (!JugeChunkChanged(jsonStats, lastStatsJson) || arrMatchs.indexOf('.html') > -1) && bs.reload();
            } else {
                bs.notify("reload css")
                bs.reload(arrCssBasename);
            }
        }

        //记录上次chunk hash值，主要用于判断js入口文件是否修改，判定是否刷新浏览器
        lastStatsJson = jsonStats;

        console.log(chalk.cyan('  Build complete.\n'))
    });
})

/**
 * 判断入口js文件是否有修改，避免js未改动的保存导致浏览器刷新
 * @param {object} jsonStats 
 * @param {object} lastStatsJson 
 */
const JugeChunkChanged = (jsonStats, lastStatsJson) => {
    if (!lastStatsJson) {
        return true;
    }
    let isHasChanged = true;
    const chunks = jsonStats.chunks,
        lastchunks = lastStatsJson.chunks;
    for (let index = 0; index < chunks.length; index++) {
        const item = chunks[index];
        const newHash = item.hash,
            id = item.id
        isHasChanged = lastchunks.some(x => x.id === id && x.hash == newHash)
        if (!isHasChanged) {
            return isHasChanged;
        }
    }
    return isHasChanged;
}