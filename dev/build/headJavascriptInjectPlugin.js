function HeadJavascriptInjectPlugin(options) {
    // Configure your plugin with options...
    this.options = options;
}

HeadJavascriptInjectPlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', compilation => {
        compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
            var html = htmlPluginData.html
            if (this.options && this.options.headJavascript) {
                html = html.replace('{{{__HEAD_JAVASCRIPT__}}}', this.options.headJavascript)
                htmlPluginData.html = html
            }
            // callback(null, htmlPluginData)
        })
    })
}

module.exports = HeadJavascriptInjectPlugin