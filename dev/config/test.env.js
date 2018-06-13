'use strict'

const base_api = "https://test.com/api/v1/",
	qbjr_uri = "http://jrm.qianbao.com";

module.exports = {
	NODE_ENV: '"testing"',
	BASE_API: `"${process.env.BASE_API || base_api}"`,
	QBJR_URI: `"${process.env.QBJR_URI || qbjr_uri}"`,
}