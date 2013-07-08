var path = require('path');
exports.install = function (server, manage) {
    'use strict';

    var logger = manage.logger;
    server.get('/', function (req, res, next) {
        logger.debug('next');
        next();
    },function (req, res, next) {
        res.render('apps/manny/index.html');
        logger.debug('done');
    });
};