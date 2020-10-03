(function (factory) {
    "use strict";
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        // borrowed from https://underscorejs.org/docs/underscore.html
        const root = (typeof self === "object" && self.self === self && self) ||
            (typeof global === "object" && global.global === global && global) ||
            this ||
            {};
        root.GSMJsBridge = factory();
    }
}(function () {
    "use strict";
    // @see also https://confluence.garmin.com/display/CDMAPAPP/GS+-+Store+Bridge
    // https://confluence.garmin.com/display/CDMAPAPP/DEV+-+Online+Store+Interface
    const MobileOsEnum  = {
            Android: 0,
            iOS: 1,
            WPhone: 2,
            Others: 3
        }, callbacks = {};

    let guid = 0,
        DEBUG = true;

    function isiOS (ua) {
        ua = ua || navigator.userAgent;
        return /ip(hone|od|ad)/i.test(ua);
    }

    function isAndroid (ua) {
        ua = ua || navigator.userAgent;
        return /(android|bb\d+|meego).+mobile|Android/i.test(ua);
    }

    function isWPhone (ua) {
        ua = ua || navigator.userAgent;
        return /windows phone/i.test(ua);
    }

    function getMobileOs () {
        // Windows Phone must come first because its UA also contains "Android"
        if (isWPhone()) {
            return MobileOsEnum.WPhone;
        }

        if (isAndroid()) {
            return MobileOsEnum.Android;
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (isiOS() && !window.MSStream) {
            return MobileOsEnum.iOS;
        }

        return MobileOsEnum.Others;
    }

    function log () {
        /* eslint-disable no-console */
        if (DEBUG) {
            console.log.call(console, Array.prototype.join.call(arguments, " "));
        }
        /* eslint-enable no-console */
    }

    function invoke (command) {
        log("invoke", command);
        const os = getMobileOs(),
            commandIdentifying = "gsmClient://bridge/";
        if (os === MobileOsEnum.Android || os === MobileOsEnum.iOS) {
            prompt(command, commandIdentifying);
        } else {
            // TODO more platform
            log("unknown platform");
        }
    }

    /**
     * webview and gsm communication interface
     * @param opt {object} {module: string, action: string, param: object, success: function, error: function}
     * GSM JS bridge options, success: function will receive only one argument
     * @example gsmJSBridge.callByJS({
     *    module: "MktActivity",
     *    action: "OpenPage",
     *    param: {
     *        url: "/web/competition/100"
     *    },
     *    success: function ()  {
     *        // OpenPage success
     *    },
     *    error: function () {
     *        // OpenPage error
     *    }
     * });
     * @memberOf fe/GSMJsBridge
     * @see https://confluence.garmin.com/pages/viewpage.action?pageId=201654319
     */
    function callByJS (opt) {
        log("callByJS", JSON.stringify(opt));
        const input = {};
        input.module = opt.module;
        input.action = opt.action;
        input.token = ++guid;
        input.param = opt.param || {};
        callbacks[input.token] = {success: opt.success, error: opt.error};
        invoke(JSON.stringify(input));
    }

    /**
     *
     * @param {{token: string, ret: *, success: boolean, script: string}} opt - options for GSM callback webview js interface
     * @ignore
     */
    function callByNative (opt = {}) {
        log("callByNative", JSON.stringify(opt));
        const script = opt.script || "";
        // native call web active
        if (script) {
            log("callByNative script", script);
            try {
                eval(script);
            } catch (e) {
                /* eslint-disable no-console */
                console.error(e);
                /* eslint-enable no-console */
            }
        } else {
            const successCallback = callbacks[opt.token].success,
                errorCallback = callbacks[opt.token].error,
                // function apply in default, set to false if need array params
                isArgList = "arglist" in opt ? opt.arglist : true,
                success = opt.success;
            // @type {*|array<*>}
            // callback functions arguments
            let args = opt.ret,
                isAry = function (arg) {
                    return Object.prototype.toString.call(arg) === "[object Array]";
                };

            if (isArgList) {
                // compatible single param
                if (opt.hasOwnProperty("ret") && !isAry(args)) {
                    args = [args];
                }
                // not pass ret
                if (!isAry(args)) {
                    args = [];
                }
            }

            if (success && typeof successCallback === "function") {
                log("successCallback", args);
                if (isArgList) {
                    successCallback.apply(null, args);
                } else {
                    successCallback(args);
                }
            } else if (!success && typeof errorCallback === "function") {
                log("errorCallback", args);
                if (isArgList) {
                    errorCallback.apply(null, args);
                } else {
                    errorCallback(args);
                }
            }

            try {
                delete callbacks[opt.token];
                log("delete callback");
            } catch (e) {
                /* eslint-disable no-console */
                console.error(e);
                /* eslint-enable no-console */
            }
        }
    }

    // isBrowserEnv = typeof window !== "undefined" && window;
    if (typeof window !== "undefined" && window) {
        // webview interface for GSM use
        window.HybridBridge = {
            callByNative: callByNative
        };
        window.__log = log;
        // GSM call HybridBridge example
        // HybridBridge.callByNative({
        //     "ret": true,
        //     "token": 1,
        //     "success": true
        // });
    }

    /**
     * gs-common module path `fe/GSMJsBridge` or `dist/fe/GSMJsBridge` with babel translated
     * @namespace fe/GSMJsBridge
     */
    return {
        callByJS: callByJS,
        /**
         *
         * @param {boolean} debug - debug mode flag, default true
         * @returns {this}
         * @memberOf fe/GSMJsBridge
         */
        debug: function (debug) {
            if (arguments.length === 0) {
                return DEBUG;
            }
            if (typeof debug === "boolean") {
                DEBUG = debug;
            }
            return this;
        }
    };
}));