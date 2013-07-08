var logger = require('tracer').console();
var path = require('path');
exports.install = function (server, manage) {
    'use strict';
    server.all('*', function (req, res, next) {
        res.locals.settings = server.settings;
        res.locals.session = req.session;
        next();
    });
    server.get('/404', function (req, res, next) {
        res.render('apps/imagetea/404.html');
    });
};