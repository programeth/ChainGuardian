const merge = require('webpack-merge');

const baseConfig = require('./webpack.renderer.config');
const baseProdConfig = require('./webpack.base.prod.config');

module.exports = merge.smart(baseConfig, baseProdConfig, {
    mode: 'production'
});
