var path = require('path');
var fs = require('fs');
var request = require('request');

var UserAgent = {
    'iphone': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3',
    'iphone3': 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/1A542a Safari/419.3',
    'iphone4': 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7',
    'iphone5': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3',
    'ipad': 'Mozilla/5.0 (iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3',
    'MQQBrowser': 'MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
    'UC': 'JUC (Linux; U; 2.3.7; zh-cn; MB200; 320*480) UCWEB7.9.3.103/139/999',
    'Firefox': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:7.0a1) Gecko/20110623 Firefox/7.0a1 Fennec/7.0a1',
    'Opera': 'Opera/9.80 (Android 2.3.4; Linux; Opera Mobi/build-1107180945; U; en-GB) Presto/2.8.149 Version/11.10',
    'BlackBerry': 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+',
    'WebOS': 'Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.70 Safari/534.6 TouchPad/1.0',
    'NokiaN97': 'Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/20.0.019; Profile/MIDP-2.1 Configuration/CLDC-1.1) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.18124',
    'WindowsPhone': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)'
}
exports.install = function (server, manage) {
    'use strict';

    var logger = manage.logger;
    server.get('/focus', function (req, res, next) {
        res.locals.ua = UserAgent;
        if (req.host.indexOf('focus.peaches.io') > -1) {
            res.locals.proxy_url = 'http://focus.peaches.io/proxy/';
        } else {
            res.locals.proxy_url = '/focus/proxy/';
        }
        res.locals.url = req.query.url || '';
        next();
    }, function (req, res, next) {
        res.render('apps/focus/index.html')
    });
    server.get('/focus/proxy/:mode/:url', function (req, res, next) {
        var ua = UserAgent[req.params.mode] || req.get('User-Agent');
        res.locals.ua = ua;
        res.locals.url = decodeURIComponent(req.params.url);
        next();
    }, function (req, res, next) {
        res.set({
            'Content-Type': 'text/html;charset=utf-8'
        });
        try{
            request.get(res.locals.url, {
                headers: {
                    'User-Agent': res.locals.ua
                },
                timeout:2000
            }).pipe(res);
        }
        catch(e){
            res.end('«Î÷ÿ ‘£°');
        }
        
    });
}