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
const bs = require('browser-sync').get('bs-webpack-plugin');

// const spinner = ora('building for production...')
// spinner.start()

rm(config.build.assetsRoot, err => {
    if (err) throw err
    const compiler = webpack(webpackConfig);
    let changedFiles = [];
    compiler.plugin("watch-run", (watching, done) => {
        const changedTimes = watching.watchFileSystem.watcher.mtimes;
        changedFiles = Object.keys(changedTimes)
            .map(file => `\n  ${file}`);
        // .join("");
        done();
    });
    compiler.plugin("done", function(stats) {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
            console.log(stats.compilation.errors);
            // process.exit(1); // or throw new Error('webpack build failed.');
        }
    });

    compiler.watch({ // watch options:
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
            // pass a number to set the polling interval
    }, function(err, stats) {
        if (err) throw err

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
                // process.exit(1)
        }
        if (changedFiles.length) {
            console.log("New build triggered, files changed:", changedFiles);
            let isHasJsOrHtmlChanged = false;
            const arrCssBasename = [];
            changedFiles.forEach((value, index) => {
                const matchs = value.match(/(?!(\.css|\.scss|\.sass|\.less))(\..*)$/g)
                console.log(matchs)
                if (matchs && matchs.length > 0) {
                    isHasJsOrHtmlChanged = true;
                    return false;
                } else {
                    arrCssBasename.push(path.basename(value).replace(path.extname(value), '.css'));
                }
            });
            console.log(isHasJsOrHtmlChanged, arrCssBasename)
            if (isHasJsOrHtmlChanged) {
                bs.reload();
            } else {
                bs.reload(arrCssBasename);
            }
        }

        var jsonStats = stats.toJson();
        if (jsonStats.errors.length > 0) {
            chalk.red(jsonStats.errors);
            bs.notify(jsonStats.errors, 200000);
        }
        if (jsonStats.warnings.length > 0)
            console.log(jsonStats.warnings);
        // process.stdout.write(jsonStats.warnings);

        console.log(chalk.cyan('  Build complete.\n'))

    });
})