/**
 * 全局配置文件。
 * @author:蔡伦<liuqin.sheng@alipay.com>
 * path 配置的约定
 * 1.文件路径一律使用内置的path处理。
 */
var path = require('path');

exports.SMTP = require('./settings/SMTP').SMTP;
/* 默认的皮肤 */
var APP_THEME = 'default';
/* 默认启动端口 */
exports.DEFALUT_PORT = 8084;
/* 默认分页条数 */
exports.PAGE_LIMIT = 15;
/* */
exports.TITLE = 'Peaches';
exports.APP_THEME = APP_THEME;
exports.PROJ_ROOT = path.join(__dirname);
exports.APPS_ROOT = path.join(__dirname, 'apps');
var STATIC_ROOT = path.join(__dirname, 'static');
exports.STATIC_ROOT = STATIC_ROOT;
exports.views = path.join(__dirname, 'templates', APP_THEME);
exports['view engine'] = 'html';
exports['view options'] = {
    layout: 'false'
};

exports.INSTALLED_APPS = ['default', 'manny', 'slowly', 'focus'];

exports.PEACHES_ROOT = path.join(STATIC_ROOT, 'peaches');
exports.CLOUD = {
    root: path.join(STATIC_ROOT, 'cloud'),
    tmp: path.join(STATIC_ROOT, 'cloud', 'tmp')
};


var settings;
if (process.env.NODE_ENV === 'production') {
    settings = require('./settings/prod');
    settings.env = 'production';
} else {
    settings = require('./settings/dev');
    settings.env = 'development';
}
for (var o in settings) {
    if (settings.hasOwnProperty(o)) {
        exports[o] = settings[o];
    }
}

