'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://dev.com/api/v1/"',
  QBJR_URI: '"http://jrm.qianbao.com"'
})
