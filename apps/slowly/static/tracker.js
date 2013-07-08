/*
 * Light JavaScript Library
 * The core of Light
 * 
 * @copyright Copyright 2011, alipay.com
 * @author janlay@gmail.com
 *
 * $Id: core.js 20163 2011-11-02 09:15:19Z qiuping.zhou $
 */
window.light||function(window,undefined){var document=window.document,navigator=window.navigator,location=window.location;
    var urlParts,ajaxLocation,rurl=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?([^?#]*))?/;
    try{ajaxLocation=location.href}catch(e){ajaxLocation=document.createElement("a");
        ajaxLocation.href="";ajaxLocation=ajaxLocation.href}urlParts=rurl.exec(ajaxLocation.toLowerCase())||[];
    var light={version:"0.1",timestamp:new Date().getTime(),debug:urlParts[2].indexOf("alipay.com")===-1,baseDomain:function(){var parts=urlParts[2].split(".");
        return parts.length>2?parts[parts.length-2]+"."+parts[parts.length-1]:urlParts[2]
    }(),urlParts:urlParts,toString:function(){var result="Light JavaScript Library version "+light.version;
        if(light.debug){result+=", debug enabled"}result+=".";return result},toArray:function(list){return Array.prototype.slice.apply(list)
    },register:function(path,root,obj){var items=path.split("/"),parent=root||light;if(!items[0]){parent=window;
        items.shift()}var name,me=parent;for(var i=0,l=items.length-1;i<l;i++){if(!(name=items[i])){continue
    }parent=parent[name]=parent[name]||{}}name=items[i];if(name){parent=parent[name]=obj===undefined?{}:obj
    }return parent},extend:function(deep){var args=light.toArray(arguments);if(typeof args[0]!=="boolean"){args.unshift((deep=false))
    }if(args.length<2){return null}var start=2,o=args[1],obj;if(args.length===2){start=1;
        o=light}for(var i=start,l=args.length;i<l;i++){obj=args[i];if(!obj||typeof obj!=="object"){continue
    }for(var prop in obj){var item=obj[prop];if(item===o||!obj.hasOwnProperty(prop)){continue
    }if(light.isArray(item)){o[prop]=Array.prototype.concat.call(item)}else{if(deep&&item instanceof Object&&!light.isFunction(item)&&!item.nodeType){var tmp=o[prop]||{};
        o[prop]=light.extend(true,tmp,obj[prop])}else{if(item!==undefined){o[prop]=item}}}}}return o
    },deriveFrom:function(superClass,instanceMembers,staticMembers){if(arguments.length<2){return superClass
    }var klass=(instanceMembers&&instanceMembers.init)||function(){superClass.constructor.apply(this,arguments)
    };light.extend(true,klass.prototype,superClass.prototype,instanceMembers);klass.constructor=klass;
        staticMembers&&light.extend(true,klass,staticMembers);klass.__super=superClass;return klass
    },module:function(name,obj){var o=light.register(name,null,obj);if(light.isFunction(obj)){o.constructor=obj
    }return o},each:function(object,callback,args){if(!object){return object}var length=object.length;
        if(length!==undefined&&"reverse" in object){var i=0;while(i<length){if(callback.call(object[i],i,object[i],object)===false){break
        }i++}}else{var name;for(name in object){if(callback.call(object[name],name,object[name],object)===false){break
        }}}return object},isFunction:function(obj){return light.type(obj)==="function"},isArray:Array.isArray||function(obj){return light.type(obj)==="array"
    },isWindow:function(obj){return obj&&typeof obj==="object"&&"setInterval" in obj},type:function(obj){return(obj===null||obj===undefined)?String(obj):class2type[Object.prototype.toString.call(obj)]||"object"
    },has:function(path){if(!path){return false}var parts=path.split("/"),head=light,i,len;
        if(!parts[0]){head=window;parts.shift()}for(i=0,len=parts.length;i<len;i++){head=head[parts[i]];
            if(head===undefined){return false}}return true},noop:function(){}};var class2type={};
    light.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase()
    });window.light=light}(window);
/*
 * Light JavaScript Library
 * Utilities for Light
 * 
 * @copyright Copyright 2011, alipay.com
 * @author janlay@gmail.com
 *
 * $Id: util.js 20304 2011-11-03 09:31:32Z qiuping.zhou $
 */
light.log||light.extend({log:function(){if(!light.debug||!window.console||!console.log){return function(){if(!light.debug){return
}try{window.console&&console.log&&console.log.apply(console,arguments)}catch(e){}}
}if(Function.prototype.bind){return function(){if(!light.debug){return}var fn=Function.prototype.bind.call(console.log,console);
    fn.apply(console,arguments)}}else{if(console.log.apply){return function(){if(!light.debug){return
}console.log.apply(console,arguments)}}else{return light.debug?console.log:light.noop
}}}(),inspect:function(obj){if(window.JSON&&JSON.stringify){return JSON.stringify(obj)
}else{if(typeof obj==="object"){var value,result=[],root=obj;for(var prop in root){if(typeof(value=root[prop])=="object"){result.push(arguments.callee(value))
}else{result.push(prop+"="+root[prop])}}return result.join("\n")}else{return String(obj)
}}},track:function(){var buffer=[],send=function(seed){if(window.Tracker){Tracker.click(seed)
}else{buffer.push(seed);window.setTimeout(function(){send(buffer.shift())},100)}};
    return function(seed,withClientInfo){if(!seed){return}if(withClientInfo){var ua=light.client.info,ver=ua.browser.version;
        ver=ver?ver[0]:"na";seed+="-"+(ua.browser.name||"na")+"-"+(ua.engine.name||"na")+"-"+ver
    }send(seed)}}(),trim:function(text){if(!text){return""}return String.prototype.trim?String.prototype.trim.apply(text):text.replace(/^\s+|\s+$/g,"")
},substitute:function(template,map){if(!template){return""}if(!map){return template
}if(typeof template!=="string"){throw"invalid template"}return template.replace(new RegExp("{\\w+}","gmi"),function(property){var prop=property.substr(1,property.length-2);
    return prop in map?map[prop].toString():""})},encode:encodeURIComponent||escape,decode:decodeURIComponent||unescape,param:function(obj,splitter,connector){splitter=splitter||"=";
    var stack=[];light.each(obj,function(property,value){if(!property||!obj.hasOwnProperty(property)){return
    }stack.push(light.encode(property)+splitter+light.encode(value))});return stack.join(connector||"&")
},unparam:function(text,splitter,connector){var obj={};if(!text){return obj}splitter=splitter||"=";
    light.each(text.split(connector||"&"),function(i,item){var pair=item.split(splitter,2);
        if(!pair[0]||pair.length!==2){return}obj[light.decode(pair[0])]=light.decode(pair[1])
    });return obj},trimTag:function(html){if(!html||!document.createElement){return""
}var el=document.createElement("DIV");el.innerHTML=html;var text=el.textContent||el.innerText||"";
    el=null;return text},escapeHTML:function(html){if(!html){return""}var str=html.replace(/>/g,"&gt;");
    str=str.replace(/</g,"&lt;");str=str.replace(/&/g,"&amp;");str=str.replace(/"/g,"&quot;");
    str=str.replace(/'/g,"&#039;");return str},unescapeHTML:function(text){if(!text){return""
}var str=text.replace(/&gt;/g,">");str=str.replace(/&lt;/g,"<");str=str.replace(/&amp;/g,"&");
    str=str.replace(/&quot;/g,'"');str=str.replace(/&#039;/g,"'");return str},toJSON:function(source){if(typeof source!=="string"||!source){return null
}var data=light.trim(source);return window.JSON&&JSON.parse?JSON.parse(data):(new Function("return "+data))()
}});light.queue||(function(){var queue=function(){this.stack=[];var that=this,args=[].slice.call(arguments,0);
    args&&light.each(args,function(arg){that.add(arg)})};queue.prototype={add:function(fn){this.stack.push(fn)
},clear:function(){this.stack=[]},invoke:function(){var that=this,args=[].slice.call(arguments,0);
    fn=this.stack.shift();this.next||(this.next=function(){if(that.stack.length){that.invoke.apply(that,args)
    }});fn.apply(null,[this.next].concat(args))}};light.queue=queue})();
/*
 * Light JavaScript Library
 * Client information dection
 * 
 * @copyright Copyright 2011, alipay.com
 * @author janlay@gmail.com
 *
 * $Id: info.js 18350 2011-09-19 12:35:25Z taibo $
 */
light.has("client/info")||function(window,light,undefined){var document=window.document,navigator=window.navigator,location=window.location;
    var userAgent=navigator.userAgent?navigator.userAgent.toLowerCase():"",platform=navigator.platform||"",vendor=navigator.vendor||"",external=window.external;
    var data={device:{pc:"windows",ipad:"ipad",ipod:"ipod",iphone:"iphone",mac:"macintosh",android:"android",nokia:/nokia([^\/ ]+)/},os:{windows:/windows nt (\d)\.(\d)/,macos:/mac os x (\d+)[\._](\d+)(?:[\._](\d+))?/,linux:"linux",ios:/iphone os (\d)[\._](\d)/,android:/android (\d)\.(\d)/,chromeos:/cros i686 (\d+)\.(\d+)(?:\.(\d+))?/,windowsce:userAgent.indexOf("windows ce ")>0?(/windows ce (\d)\.(\d)/):"windows ce",symbian:/symbianos\/(\d+)\.(\d+)/,blackberry:"blackberry"},engine:{trident:/msie (\d+)\.(\d)/,webkit:/applewebkit\/(\d+)\.(\d+)/,gecko:/gecko\/(\d+)/,presto:/presto\/(\d+).(\d+)/},browser:{"360":function(){if(!info.os.windows){return false
    }if(external){try{return external.twGetVersion(external.twGetSecurityID(window)).split(".")
    }catch(e){try{return external.twGetRunPath.toLowerCase().indexOf("360se")!==-1||!!external.twGetSecurityID(window)
    }catch(e){}}}return(/360(?:se|chrome)/)},mx:function(){if(!info.os.windows){return false
    }if(external){try{return(external.mxVersion||external.max_version).split(".")}catch(e){}}return userAgent.indexOf("maxthon ")!==-1?(/maxthon (\d)\.(\d)/):"maxthon"
    },sg:/ se (\d)\./,tw:function(){if(!info.os.windows){return false}if(external){try{return external.twGetRunPath.toLowerCase().indexOf("theworld")!==-1
    }catch(e){}}return"theworld"},qq:function(){return userAgent.indexOf("qqbrowser/")>0?(/qqbrowser\/(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?/):(/tencenttraveler (\d)\.(\d)/)
    },ie:userAgent.indexOf("trident/")>0?(/trident\/(\d+)\.(\d+)/):(/msie (\d+)\.(\d+)/),chrome:/chrome\/(\d+)\.(\d+)\.(\d+)(?:\.([ab\d]+))?/,safari:/version\/(\d+)\.(\d+)(?:\.([ab\d]+))? safari\//,firefox:/firefox\/(\d+)\.([ab\d]+)/,opera:/opera.+version\/(\d+)\.([ab\d]+)/},feature:{"64bitBrowser":"win64; x64;","64bitOS":/win64|wow64/,security:/ (i|u|s|sv1)[;\)]/,simulator:function(){return info.os.ios&&screen.width>960
    }}};var detected=-1,notDetected=0,info={},has=function(type,name,version){var currentVersion;
        if(!info[type]||!(currentVersion=info[type][name])){return false}if(!version){return true
        }var v=version;if(typeof v==="string"){v=v.split(".")}else{if(typeof v==="number"){v=[v]
        }}var v1,v2;for(var i=0,len=Math.max(v.length,currentVersion.length);i<len;i++){v1=parseInt(v[i],10)||0;
            v2=parseInt(currentVersion[i],10)||0;if(v1!==v2){return v1<v2}}return true};light.each(data,function(item,itemData){info["has"+item.charAt(0).toUpperCase()+item.slice(1)]=function(name,version){return has(item,name,version)
    };var entry=info[item]={};light.each(itemData,function(name,expression){var version=[notDetected],expr=light.isFunction(expression)?expression.apply(info):expression;
        if(expr){if(expr===true){version=[detected]}else{if(typeof expr==="string"){version=[userAgent.indexOf(expr)!==-1?detected:notDetected]
        }else{var v=expr;if(expr.exec){v=expr.exec(userAgent)||[];v.length&&v.shift()}for(var i=0;
                                                                                          i<v.length;i++){version[i]=parseInt(v[i],10)||0}}}}var found=!!version[0];if(found){entry[name]=entry.version=version;
            entry.name=name}return !found})});if(!info.engine.name&&window.ActiveXObject){if(document.documentMode){info.engine.trident=info.engine.version=[document.documentMode,0]
    }else{if(!info.engine.trident){info.engine.trident=info.engine.version=[detected]
    }}info.engine.name="trident"}else{if(!info.os.windows&&info.hasEngine("trident",6)){info.os.windows=info.os.version=[detected];
        info.os.name="windows"}}if(info.browser.ie&&userAgent.indexOf("trident/")>0){info.browser.ie[0]=info.browser.version[0]=info.browser.version[0]+4
    }light.module("client/info",info)}(window,light);
/*
 * Light JavaScript Library
 * Cookie or cookieless storage implement
 * 
 * @copyright Copyright 2011, alipay.com
 * @author janlay@gmail.com
 *
 * $Id: storage.js 18350 2011-09-19 12:35:25Z taibo $
 */
light.has("client/storage")||function(window,light,undefined){var document=window.document,navigator=window.navigator,location=window.location;
    var userDataId="__ud",userDataHtml='<input type="hidden" id="'+userDataId+'" style="behavior:url("#default#userData")"/>',userDataExists=false,getUserData=function(){if(!userDataExists){light.write(userDataHtml);
        userDataExists=true}return light.get(userDataId)};var storage={cookie:null,defaultStorage:window.localStorage,set:function(name,value){if(storage.cookie&&navigator.cookieEnabled){var sCookie=name+"="+encodeURIComponent(value);
        if(!storage.cookie.days){var exp=new Date(new Date().getTime()+storage.cookie.days*365*24*60*60*1000);
            sCookie+="; expires="+exp.toGMTString()}if(storage.cookie.domain){sCookie+="; domain=."+storage.cookie.domain
        }sCookie+="; path=."+(storage.cookie.path||light.urlParts[4]||"/");document.cookie=sCookie
    }if(advanced){storage.defaultStorage.setItem(name,value)}else{var node=getUserData();
        if(node){node.setAttribute(name,value);try{node.save(userDataId)}catch(e){}}}},get:function(name,defaultValue){var value;
        if(advanced){value=storage.defaultStorage.getItem(name)}else{var node=getUserData();
            if(node){try{node.load(userDataId)}catch(e){}value=node.getAttribute(name)}}if(!value&&storage.cookie&&navigator.cookieEnabled){var cookie=document.cookie,start=cookie.indexOf(name+"=");
            if(start!=-1){start+=name.length+1;var end=cookie.indexOf(";",start);if(end==-1){end=cookie.length
            }value=light.decode(cookie.substring(start,end)||"")}}return value||defaultValue||""
    }};var advanced=!!storage.defaultStorage;light.module("client/storage",storage)}(window,light);
/*!
 *
 * Alipay Log Analytics Module, v1.0.4
 * @author taibo, janlay@gmail.com, Sep 20, 2011
 * @contributor tian.liang(@hotoo), 2012.
 * $Id: tracker.js 30193 2013-02-27 11:32:31Z tian.liang $
 * Copyright 2010-2011 Alipay, All Rights Reserved.
 *
 **/
/**
 * Tracker final version released!
 * ** Control the tracker manually (Auto mode):
 * tracker.stop(); // stop/pause tracking
 * tracker.start(); // start tracking
 *
 * ** Customize the user-defined attribute (Auto mode):
 * Tracker.seedName = 'anotherseedname'; // customized seed name
 *
 * ** Manual mode, invoke it whenever you want to track the event.
 * Tracker.click('seed1');
 *
 * TODO: Acooke for alibaba.
 * TODO: referrer by window.name.
 * TODO: module for seajs
 *
 **/

// create Tracker, do nothing if Tracker exists
this.Tracker || (function (host) {
    // defines the url where track data should be sent to
    var win = host, doc = win.document, loc = win.location,
        URL = document.URL || "",
        performance = win.performance, light = win.light, t, startTime,
        protocol = loc.protocol,
        SERVER_URL = protocol + '//kcart.alipay.com/web/bi.do',
        ACOOKIE_SERVER_URL = protocol + '//kcart.alipay.com/web/1.do',
        MMSTAT_SERVER_URL = protocol + '//log.mmstat.com/5.gif',
        MAX_READY_TIME = 20000, SAMPLE_RATE = 8,
        PROFILE_NAME = 'BIProfile', DEFAULT_PROFILE = 'clk', PROFILES = { p: '' };

    // use IE 9 performance instead if applicable
    if (performance && performance.timing) {
        startTime = performance.timing.navigationStart;
    } else if (win._to && _to.start) {
        startTime = _to.start.getTime();
    }

    /**
     * Tracker: represents a tracker working on the page.
     **/
    win.Tracker = t = function () {
    };

    /**
     * compatible api
     **/
    t.prototype = {
        watch: function () {
            t.click('tracker-watch');
        }
    };

    /**
     * ***********************
     * helper functions
     * ***********************
     **/
        // extend from any sources that followed target into target
    t.extend = function (target) {
        for (var i = 1, l = arguments.length; i < l; i++) {
            for (var prop in arguments[i]) {
                if (arguments[i].hasOwnProperty(prop)) {
                    target[prop] = arguments[i][prop];
                }
            }
        }
        return target;
    };
    // @deprecated logging
    //t.log = function() {
    //// console.log.apply fails in IE8 dev toolbar
    //win.console && console.log && console.log(Array.prototype.slice.call(arguments).join(' | '));
    //};

    // static member
    t.version = '1.0';
    t.enabled = true;
    t.debug = false;
    t.seedName = 'seed';
    t.minInterval = 1000;

    var abVersion,
        metas = doc.getElementsByTagName("meta");
    for (var i = 0, name, l = metas.length; i < l; i++) {
        name = metas[i].getAttribute("name");
        if (name && name.toLowerCase() == "abtest") {
            abVersion = metas[i].getAttribute("content");
            break;
        }
    }

    function hasACookie() {
        return /\bcna=/.test(document.cookie);
    }

    var sendByImg = function (url) {
        var img = new Image(1, 1),
            rnd_id = "_img_" + Math.random();

        //在全局变量中引用 img，防止 img 被垃圾回收机制过早回收造成请求发送失败
        window[rnd_id] = img;
        img.onload = img.onerror = img.onabort = function () {
            var img = window[rnd_id];
            img.onload = null;
            img.onerror = null;
            img.onabort = null;
            img = null;
            window[rnd_id] = null;
        };

        img.src = url;
        img = null;// 删除临时变量的引用
    }


    // addEventLister implementation
    t.dispatchEvent = function (element, eventName, handler) {
        if (element.attachEvent) {
            element.attachEvent('on' + eventName, function (e) {
                handler.call(element, e);
            });
        } else if (element.addEventListener) {
            element.addEventListener(eventName, handler, false);
        } else {
            element['on' + eventName] = function (e) {
                handler.call(element, e);
            };
        }
    };

    // resolve target of event
    t.getTarget = function (e) {
        var node = e.target || e.srcElement;
        try {
            if (node && node.nodeType === 3) {
                return node.parentNode;
            }
        } catch (ex) {
        }
        return node;
    };

    // send into to the server
    t.send = function (page, referrer, more) {
        if (typeof page !== 'string' || !page) throw new Error('Invalid page');
        var p = {
            ref: referrer || '-',
            pg: page || '',
            r: new Date().getTime(),
            v: t.version
        }, imgSrc;
        if (abVersion) {
            p.ABTest = abVersion;
            //p.ref += (p.ref.indexOf("?")>=0 ? "&" : "?") + "ABTest="+abVersion;
            p.pg += (p.pg.indexOf("?") >= 0 ? "&" : "?") + "ABTest=" + abVersion;
        }
        more && light.extend(p, more);
        p = light.param(p);

        if (protocol != 'file:' && !t.debug) {

            imgSrc = SERVER_URL + '?' + p;
            sendByImg(imgSrc);
        } else {
            light.log("Tracker debug: %s.", p);
        }
    };

    /**
     * send domready & load time properly, send pv immediately.
     **/
    if (doc && loc) {
        // prepare param
        var url = URL, ref = doc.referrer, rnd = Math.random();

        // send PV
        var p = {screen: '-x-', color: '-', BIProfile: 'page'};
        // if the page in an iframe , the BIProfile is "iframe"
        if (window.parent != window) {
            p.BIProfile = 'iframe';
        }

        if (win.screen) {
            p.screen = screen.width + "x" + screen.height;
            p.sc = screen.colorDepth + "-bit";
        }
        p.utmhn = loc.hostname;
        p.rnd = rnd;

        if (win.analytic_var) {
            p.ana = analytic_var;
        }
        if (light.client) {
            var info = light.client.info,
                os,
                browser,
                engine,
                device,
                val = '';
            os = (info.os.name || 'na') + '/' + (info.os.version || [-1]).join('.');
            browser = (info.browser.name || 'na') + '/' + (info.browser.version || [-1]).join('.');
            engine = (info.engine.name || 'na') + '/' + (info.engine.version || [-1]).join('.');
            device = ( info.device.name || 'na') + '/' + (info.device.version || [-1]).join('.');
            val = os + '|' + engine + '|' + browser + '|' + device;
            p._clnt = val;
        }
        //t.send(url, ref, p);

        // reset for next request
        // TODO:
        ref = url;
        p = {};

        // don't send time info if not hit
        if (true) {
            p.BIProfile = 'load';
            var ready = 0, load = 0, rest = 100;

            // remove saved ref immediately
            var readyHandler = function () {
                if (readyHandler.invoked) return;
                readyHandler.invoked = true;

                ready = (win._to && _to.ready ? _to.ready.getTime() : new Date().getTime()) - startTime;

                if (ready > MAX_READY_TIME) { // invalid domready
                    loadHandler.invoked = true;
                    p.tm = '-x-';
                    t.send(url, '', p);
                }
            }, loadHandler = function () {
                if (ready > MAX_READY_TIME || loadHandler.invoked) return;
                loadHandler.invoked = true;

                // read load time if it is already determined
                load = (win._to && _to.end ? _to.end.getTime() : new Date().getTime()) - startTime;
                // override load time if performance data is available
                if (performance && performance.timing) {
                    ready = performance.timing.domContentLoadedEventStart - performance.timing.navigationStart;
                    load = performance.timing.loadEventStart - performance.timing.navigationStart;
                    console.log(ready,load)
                }

                send();
            }, send = function () {
                if (!ready) {
                    setTimeout(send, 50);
                    return;
                }
                if (ready > load) ready = load - rest;
                // console.log('result:', ready, ', ', load);
                if (ready < 10) return;
                p.tm = '' + ready + 'x' + load;
                p.rnd = rnd;
                t.send(url, '', p);
            };

            if (startTime) {
                if (win._to && _to.ready) {
                    readyHandler();
                } else {
                    if (win.YAHOO && YAHOO.util && YAHOO.util.Event) { // YUI 2.x
                        YAHOO.util.Event.onDOMReady(readyHandler);
                    } else if (win.jQuery) { // jQuery
                        jQuery(readyHandler);
                    } else if (win.Y && Y.on) { // YUI 3.x
                        Y.on('domready', readyHandler);
                    } else {
                        readyHandler();
                    }
                }

                // if load time determined, use it
                if (win._to && _to.end) {
                    loadHandler();
                } else {
                    win.setTimeout(loadHandler, MAX_READY_TIME * 8);
                    t.dispatchEvent(win, 'load', loadHandler);
                    t.dispatchEvent(win, 'unload', loadHandler);
                }
            }
        }
    }


    /**
     * Tracking seed
     **/
    doc && t.dispatchEvent(doc, 'mousedown', function (e) {
        var node = t.getTarget(e);
        // node resolved as object but has no property if mousedown triggered from disabled element in IE.
        if (!node || !node.nodeType) return;
        // HTML's getAttribute is not available sometimes in IE.
        // and typeof node.getAttribute not a function.
        while (node && node.nodeName != 'HTML' &&
            node.getAttribute && !node.getAttribute(t.seedName)) {

            node = node.parentNode;
        }
        if (!node || node.nodeType !== 1 || node.nodeName == 'HTML') return;

        var _scType, href, match;
        if (node.nodeName === 'A') {
            // http://msdn.microsoft.com/en-us/library/ms536429%28v=VS.85%29.aspx
            href = node.getAttribute("href", 2) || "";
            if (href === URL || href.indexOf(URL + "#") === 0) {
                href = "";
            }
            match = href.match(/[?&]_scType=([^&#]+)/);
            if (match) {
                _scType = {"_scType": match[1]};
            }
        }

        t.click(node.getAttribute(t.seedName), _scType);
    });

    // Lower level static method for manual click handler, designed for Ajax/Flash applications.
    t.click = function () {
        // first referer is current url
        var refs = {},
        // page prefix without fragment
            base_page = URL.split('?').shift();

        var idx = base_page.indexOf(";jsessionid=");
        if (idx >= 0) {
            base_page = base_page.substr(0, idx);
        }
        refs[DEFAULT_PROFILE] = URL;
        //base_page += '?seed=';

        /**
         * 页面点击监控。
         *
         * @param {String} seedName, 埋点名称，用于位置标识，如果以英文冒号分隔，
         *  则冒号前面的部分被作为 BIProfile，冒后之后的部分作为埋点名称；否则，
         *  整个作为埋点名称。
         * @param {String} extra, 扩展的自定义参数。
         */
        return function (seedName, extra) {
            if (!seedName) return;

            // extract profile and seed name.
            var parts = seedName.split(':', 2);
            parts.length >= 2 || parts.unshift(DEFAULT_PROFILE);
            var profile = parts[0];
            seedName = parts[1];
            if (!seedName) return;

            //var p = {"seed": seedName};
            //extra && light.extend(p, extra);
            //p = light.param(p);
            // Fix: #55, 将 seed 参数置于最后。
            var p = [];
            if (extra) {
                p.push(light.param(extra))
            }
            p.push('seed=' + encodeURIComponent(seedName));
            p = p.join('&');

            var page = base_page + "?" + p;
            //var page = base_page + encodeURIComponent(parts[1]) +
            //(content ? "&_scType="+encodeURIComponent(content) : "");

            // add profile
            var param;
            if (profile) param = {'BIProfile': profile};

            // issue the url...
            t.send(page, refs[profile] || "", param);

            // refresh last seed
            refs[profile] = page;
        };
    }();

    t.log = function (seed, profile) {
        t.click((profile || "syslog") + ":" + seed);
    };
    t.error = function (seed) {
        t.click("syserr:" + seed);
    };
    // 监控统计特定 seed 的最大值、最小值、平均值、中位数等。
    t.calc = function (seed, value) {
        t.click("calc:" + seed, {"value": value});
    };

})(this);
