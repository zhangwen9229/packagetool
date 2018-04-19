'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.dev.conf')
const bs = require('browser-sync').get('bs-webpack-plugin')
let lastStatsJson;

// const spinner = ora('building for production...')
// spinner.start()

rm(config.build.assetsRoot, err => {
    if (err) throw err
    const compiler = webpack(webpackConfig);
    let changedFiles = [];

    //通过watch-run检查修改文件
    compiler.plugin("watch-run", (watching, done) => {
        const changedTimes = watching.watchFileSystem.watcher.mtimes;
        changedFiles = Object.keys(changedTimes)
            .map(file => `\n  ${file}`);
        // .join("");
        done();
    });

    compiler.watch({ // watch options:
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
            // pass a number to set the polling interval
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
            console.log("New build triggered, files changed:", changedFiles);
            let isHasJsOrHtmlChanged = false;
            const arrCssBasename = [];
            changedFiles.forEach((value, index) => {
                const matchs = value.match(/(?!(\.css|\.scss|\.sass|\.less))(\..*)$/g)
                if (matchs && matchs.length > 0) {
                    isHasJsOrHtmlChanged = true;
                    return false;
                } else {
                    arrCssBasename.push(path.basename(value).replace(path.extname(value), '.css'));
                }
            });

            if (isHasJsOrHtmlChanged) {
                !JugeChunkChanged(jsonStats, lastStatsJson) && bs.reload();
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
 * 
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