var path = require('path');
var fs = require('fs');
exports.install = function (server, manage) {
    'use strict';

    var logger = manage.logger;
    server.get('/slowly', function (req, res, next) {
        next();
    },function (req, res, next) {
        res.render('apps/slowly/index.html');
    });
    server.get('/slowly/:tpl', function (req, res, next) {
        res.locals.tpl = path.join(manage.server.get('views'),'apps/slowly/'+req.params.tpl + '.html');
        fs.exists(res.locals.tpl,function(exists){
            if(!exists){
                return res.send(404);
            }
            next();
        });
        
    },function (req, res, next) {
        res.render(res.locals.tpl);
    });
};