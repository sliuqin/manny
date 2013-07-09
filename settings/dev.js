/**
 * 开发环境配置
 */
var path = require('path');

var PROTOCOL = 'http';
var DOMAIN = 'peaches.net';
exports.PROTOCOL = PROTOCOL;
exports.STATIC_URL = 'http://127.0.0.1:8084/static/';
exports.ROOT_URL = PROTOCOL + '://' + DOMAIN + '/';
exports.DEFALUT_PORT = 8084;
exports.DOMAIN = DOMAIN;
exports.uploadDir = path.join(__dirname, 'static/upload');

var DATABASES = {
    'default':{
        'DB':'peachesio',
        'ENGINE':'mongodb',
        'NAME':'mongodb://127.0.0.1/peachesio'
    }
}
exports.DATABASES = DATABASES;
