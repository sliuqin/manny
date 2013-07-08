var path = require('path');
var logger = require('tracer').console();
var moment = require('moment');
exports.install = function (server, manage) {
    'use strict';
    manage.on('server run', function (port) {
        if (!manage.server.settings.send_server_run_mail) {
            return;
        }
        var time = moment();
        manage.send_mail(
            // e-mail options
            {
                to:'sliuqin@gmail.com',
                subject:time.format('YYYY-MM-DD HH:mm:ss') + 'peaches 服务重启',
                //TODO:服务重启邮件模板
                tpl:path.join(manage.server.settings.views, 'mail/run.html'),
                data:{
                    time:time,
                    server:'peaches'
                }
            },
            // callback function
            function (error, success) {
                if (error) {
                    logger.error('{}', error);
                }
                else {
                    logger.info('server success mail has been sent!');
                }
            });
    });
};