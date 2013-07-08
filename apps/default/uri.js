exports.install = function (server, manage) {
    'use strict';
    var PROTOCOL = server.settings.PROTOCOL;
    var DOMAIN = server.settings.DOMAIN;
    server.settings.uri = {
        '404': PROTOCOL + '://' + DOMAIN + '/404/',
        'homeServer': PROTOCOL + '://' + DOMAIN + '/',
        'adminServer': PROTOCOL + '://' + DOMAIN + '/admin/',
        'authServer': PROTOCOL + '://' + 'auth.' + DOMAIN + '/',
        'testServer': PROTOCOL + '://' + DOMAIN + '/test/',
        'projectServer': PROTOCOL + '://' + DOMAIN + '/project/',
        'cloudServer': PROTOCOL + '://cloud.' + DOMAIN + '/',
        'slowlyStaticServer': '/slowly/static/' 
    };
};