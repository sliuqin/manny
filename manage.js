var path = require('path');
var EventEmitter = require('events').EventEmitter;
var express = require('express');
var swig = require('swig');
var cons = require('consolidate');

var nodemailer = require('nodemailer');
var moment = require('moment');
var fs = require('fs');
// pass the express to the connect redis module
// allowing it to inherit from express.session.Store
var _ = require('underscore');
var settings = require('./settings');
var RedisStore = require('connect-redis')(express);

function Manage() {
    'use strict';
    if (Manage._singletonInstance) {
        return Manage._singletonInstance;
    }
    Manage._singletonInstance = this;
    EventEmitter.call(this);
    this._init();
}

Manage.super_ = EventEmitter;

Manage.getInstance = function () {
    'use strict';
    return new Manage();
};

Manage.prototype = Object.create(EventEmitter.prototype, {
    constructor: {
        value: Manage,
        enumerable: false
    }
});

Manage.prototype._init = function () {
    'use strict';
    this.locals = {};
    this.server = express();

    this.configure();

};

Manage.prototype.configure = function () {
    'use strict';
    var manage = this;
    this.server.configure('all', function () {
        this.set('ROOT_DIR', __dirname);
        for (var o in settings) {
            if (settings.hasOwnProperty(o)) {
                this.set(o, settings[o]);
            }
        }
        this.engine("html", cons.swig);
        // 强制设置生产环境和开发环境都不使用缓存
        // TODO:设置生产环境使用缓存
        this.set('view cache', false);
        swig.init({
            allowErrors: false,
            autoescape: true,
            cache: false,
            encoding: 'utf8',
            //filters:mongooseForms.swig,
            root: settings.views,
            tags: {},
            extensions: {},
            tzOffset: 0
        });

        this.use(express.cookieParser('r/W?3=2.7Y2{,{9:]/}]439/2.{:4377*@3yX8(a3o3/o'));
        var session = express.session({
            secret: '2,@67G;=@*4:32+&]<))82787ww72H=o/((C}39G]+82C',
            store: new RedisStore (),
            key: 'session.id',
            cookie: { domain: '.' + manage.server.settings.DOMAIN }
        });

        /*
         * Here we use the bodyDecoder middleware to parse urlencoded request bodies
         * which populates req.body
         * req.files 使用bodyParser保存
         */
        this.use(express.bodyParser({
            keepExtensions: true,
            uploadDir: manage.server.settings.uploadDir
        }));
        this.use(session);
        this.use(express.favicon(path.join(__dirname, 'static/image/favicon.png')));
        this.use(express.compress());
        this.use(express.responseTime());
        /*
         * The methodOverride middleware allows us to set a hidden input of _method
         * to an arbitrary HTTP method to support server.put(), server.del() etc
         */
        this.use(express.methodOverride());
    });
    this.server.configure('development', function () {

        this.set('DEBUG', true);
        this.use('/static', express.static(path.join(__dirname, '/static')));
        this.use('/', express.logger('dev'));
        this.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            next();
        });


        manage.logger = require('tracer').console();
    });
    /**
     * 生产环境配置
     */
    this.server.configure('production', function () {

        this.use('/', express.logger({
            format: 'default',
            buffer: true,
            stream: (function () {
                var pathperfix = path.join(__dirname, '/logs/');

                function getStream(today) {
                    var fileName = 'express.' + today + '.log';
                    return fs.createWriteStream(path.join(pathperfix, fileName));
                }

                var today = moment().format('YYYYMMDD');
                var stream = getStream(today);
                return {
                    write: function (chunk) {
                        var now = moment().format('YYYYMMDD');
                        if (now !== today) {
                            stream.end();
                            stream.destroySoon();
                            stream = getStream(now);
                        }
                        stream.write(chunk);
                    }
                };
            })()
        }));

        this.set('DEBUG', false);

        manage.logger = require('tracer').dailyfile({
            root: path.join(__dirname, 'logs')
        });
    });

};

Manage.prototype.runServer = function (argv) {
    'use strict';
    var manage = this;
    argv = argv || [];
    var port = argv[3] || this.server.settings.DEFALUT_PORT;
    this.server.decorators = {};
    this.server.forms = {};
    this.server.errors = {};
    this.server.settings.INSTALLED_APPS.forEach(function (app, idx) {
        var o;
        app = require(path.join(manage.server.settings.APPS_ROOT, app));
        if (app.forms) {
            for (o in app.forms) {
                if (app.forms.hasOwnProperty(o)) {
                    app.forms[o].install(manage.server, manage);
                }

            }
        }

        if (app.listeners) {
            for (o in app.listeners) {
                if (app.listeners.hasOwnProperty(o)) {
                    app.listeners[o].install(manage.server, manage);
                }

            }
        }

        if (app.params) {
            app.params.install(manage.server, manage);
        }

        if (app.uri) {
            app.uri.install(manage.server, manage);
        }
        if (app.decorators) {
            app.decorators.install(manage.server, manage);
        }

        if (app.views) {
            for (o in app.views) {
                if (app.views.hasOwnProperty(o)) {
                    app.views[o].install(manage.server, manage);
                }
            }
        }
        if (app.errors) {
            _.extend(manage.server.errors, app.errors);
        }

    });
    manage.server.listen(port);
    manage.logger.info("Express server listening on port %s", port);
    manage.emit('server run', port);
};

Manage.prototype.send_mail = function (options, next) {
    'use strict';
    nodemailer.SMTP = this.server.settings.SMTP;
    var opt = {
        //发件人
        sender: '"peaches.io" <peaches@peaches.io>',
        //收件人
        to: '',
        //邮件主题
        subject: '',
        //邮件模版
        tpl: '',
        data: {}
    };
    _.extend(opt, options);

    if (opt.tpl) {
        var tpl = require('swig').compileFile(opt.tpl);
        opt.html = tpl.render(opt.data);
    }
    nodemailer.send_mail(opt, function (error, success) {
        next(error);
    });
};

exports.Manage = Manage;

// Only listen on $ node server.js
if (!module.parent) {
    var argv = process.argv;
    var firstArgv = argv[2];
    var manage = Manage.getInstance();
    switch (firstArgv) {
    /**
     * 启动web服务  node manage.js runServer node manage.js runServer 8081
     */
        case 'runserver':
            manage.runServer(argv);
            break;
        case 'createsuperuser':
            break;
        default:
            // 为支持supervisor，默认 node manage.js 时，作为启动runServer使用
            // 注：supervisor 不支持带参数执行
            manage.runServer(argv);
            break;
    }
}