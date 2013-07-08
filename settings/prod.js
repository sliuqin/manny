/**
 * 生产环境配置
 */
var PROTOCOL = 'http';
var DOMAIN = 'peaches.io';
exports.PROTOCOL = PROTOCOL;
exports.STATIC_URL = 'http://static.manny.peaches.io/';
exports.ROOT_URL = PROTOCOL + '://' + DOMAIN + '/';
exports.DEFALUT_PORT = 8085;
exports.DOMAIN = DOMAIN;
//当启动系统时,是否发送邮件.
exports.send_server_run_mail = false;
exports.uploadDir = '/tmp';

var DATABASES = {
    'default':{
        'DB':'peachesio',
        'ENGINE':'mongodb',
        'NAME':'mongodb://127.0.0.1/peachesio'
    }
};

exports.DATABASES = DATABASES;
