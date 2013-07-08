var path = require('path');
var fs = require('fs');
var static_dir = path.join(__dirname, '../static');
var send = require('send');

exports.install = function (server, manage) {
    'use strict';

    var logger = manage.logger;
    server.get('/slowly/static/:delay/:file', function (req, res, next) {
        res.locals.delay = parseInt(req.params.delay, 10) || 0;
        res.locals.file = path.join(static_dir, req.params.file);
        next();
    }, function (req, res, next) {
        fs.exists(res.locals.file, function (exists) {
                if (!exists) {
                    return res.send(404);
                }
                next();
            }
        );
    }, function (req, res, next) {
        setTimeout(function () {
            send(req, res.locals.file).pipe(res);
        }, res.locals.delay);
    });
};