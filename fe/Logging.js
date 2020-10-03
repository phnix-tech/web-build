/**
 * @namespace fe/Logging
 */
(function (factory) {
    "use strict";
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    }
}(function () {
    "use strict";

    let logging,
        isBrowserEnv = typeof window !== "undefined" && window,
        CONSOLE_METHOD_NAME = {
            DEBUG: "debug",
            INFO: "info",
            WARN: "warn",
            ERROR: "error",
            ASSERT: "assert",
            TRACE: "trace",
            LOG: "log"
        };

    /**
     * Logging class
     * @see https://developer.chrome.com/devtools/docs/console-api
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Console
     */
    function Logging () {

    }

    Logging.LEVEL = {
        DEBUG: "DEBUG",
        INFO: "INFO",
        WARN: "WARN",
        ERROR: "ERROR",
        ASSERT: "ASSERT",
        TRACE: "TRACE",
        // LOG level nodejs use only
        LOG: "LOG"
    };

    // control logging message or not flag
    // default false, browser env: false, nodejs env: true
    Logging.ENABLED = !isBrowserEnv;

    // @see https://goo.gl/GPwvqj
    // true prevents the firing of the default event handler
    // default true
    Logging.DDEH = true;

    // send logging to server flag
    // logging will be send to server by default in browser environment
    // nodejs env no need send logging
    // useful for disable it if debug error
    Logging.SEND = isBrowserEnv;

    (function () {
        /**
         * @param methodName {CONSOLE_METHOD_NAME} - console method name
         * @param level {Logging.LEVEL}
         * @param msgs {Array<?>} Array of messages
         * @ignore
         */
        const logFn = function (methodName, level, msgs) {
            // convert array like arguments to Array for use array methods
            msgs = Array.prototype.slice.call(msgs);

            let method,
                type,
                isNotLogging = !Logging.ENABLED ||
                    msgs.length <= 0 ||
                    typeof console !== "object";

            // error log send to server in default
            // otherwise false
            const isSend = hasSendFlagInLogParam(msgs) ?
                msgs.pop() : level === Logging.LEVEL.ERROR;

            msgs = fmtLogMessage(level, msgs);
            // send logging firstly
            sendLogToServer(level, msgs, isSend);

            if (isNotLogging) {
                return;
            }

            /* eslint-disable no-console */
            methodName = methodName.toLowerCase();
            method = console[methodName];
            type = typeof method;

            switch (type) {
                case "function":
                    if (typeof method.apply === "function") {
                        try {
                            method.apply(console, msgs);
                        } catch (e) {
                            console.warn(e);
                        }
                    }
                    break;
                case "object":  // old ie
                    try {
                        // join varargs message in space separated
                        method(Array.prototype.join.call(msgs, " "));
                    } catch (e) {
                        console.warn(e);
                    }
                    break;
            }
            /* eslint-enable no-console */
        };

        /**
         * logging message using Console.trace api if supported
         * @memberOf fe/Logging
         * @method log
         */
        this.log = function () {
            const method = isBrowserEnv ?
                // print stack trace in browser env
                CONSOLE_METHOD_NAME.TRACE :
                // only print log message in nodejs env
                CONSOLE_METHOD_NAME.LOG;

            logFn.call(null, method, Logging.LEVEL.LOG, arguments);
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method debug
         */
        this.debug = function () {
            const method = isBrowserEnv ?
                CONSOLE_METHOD_NAME.DEBUG :
                // nodejs console.debug no output
                // we use console.log method
                CONSOLE_METHOD_NAME.LOG;

            logFn.call(null, method, Logging.LEVEL.DEBUG, arguments);
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method debug
         */
        this.info = function () {
            logFn.call(null, CONSOLE_METHOD_NAME.INFO, Logging.LEVEL.INFO, arguments);
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method warn
         */
        this.warn = function () {
            logFn.call(null, CONSOLE_METHOD_NAME.WARN, Logging.LEVEL.WARN, arguments);
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method error
         */
        this.error = function () {
            const method = isBrowserEnv ?
                // browser env console.error will also print stack trace
                CONSOLE_METHOD_NAME.ERROR :
                CONSOLE_METHOD_NAME.TRACE;

            logFn.call(null, method, Logging.LEVEL.ERROR, arguments);
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method assert
         */
        this.assert = function () {
            logFn.call(null, CONSOLE_METHOD_NAME.ASSERT, Logging.LEVEL.ASSERT, arguments);
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method trace
         */
        this.trace = function () {
            logFn.call(null, CONSOLE_METHOD_NAME.TRACE, Logging.LEVEL.TRACE, arguments);
            return this;
        };

        /**
         * public method control logging message or not
         * @memberOf fe/Logging
         * @method enabled
         * @param flag {Boolean}
         */
        this.enabled = function (flag) {
            if (arguments.length === 0) {
                return Logging.ENABLED;
            }
            if (typeof flag === "boolean") {
                Logging.ENABLED = flag;
            }
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method ddeh
         */
        this.ddeh = function (ddeh) {
            if (arguments.length === 0) {
                return Logging.DDEH;
            }
            if (typeof ddeh === "boolean" ||
                ddeh === null ||
                ddeh === undefined) {
                Logging.DDEH = ddeh;
            }
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method send
         */
        this.send = function (send) {
            if (arguments.length === 0) {
                return Logging.SEND;
            }
            if (typeof send === "boolean") {
                Logging.SEND = send;
            }
            return this;
        };

        /**
         * @memberOf fe/Logging
         * @method ensureErrorHandler
         */
        this.ensureErrorHandler = function () {
            // window.addEventListener("error", errorHandler);
            // register event handler
            if (window.onerror !== errorHandler) {
                window.onerror = errorHandler;
            }
            return this;
        };

    }.call(Logging.prototype));

    /**
     * append time & level tag in the beginning of log message
     * e.g. [2017/06/30 18:00:46.423 +0800] INFO log message
     * @ignore
     * @param level {Logging.LEVEL}
     * @param msgs {Array<*>} Array of messages
     * @returns {Array<*>} Array of messages
     */
    function fmtLogMessage (level, msgs) {
        let t = new Date(),
            tz,
            fmt = el => el < 10 ? "0" + el.toString() : el;

        if (msgs.length <= 0) {
            return msgs;
        }

        tz = t.getTimezoneOffset();
        tz = (tz < 0 ? "+" : "-") +
            ("00" + Math.floor(Math.abs(tz) / 60)).slice(-2) +
            ("00" + (Math.abs(tz) % 60)).slice(-2);

        // time format for splunk extract event
        // e.g. [2017/06/30 18:00:46.423 +0800]
        t = [
            t.getFullYear(),
            t.getMonth() + 1,
            t.getDate()
        ].map(fmt).join("/") + " " +
            [
                t.getHours(),
                t.getMinutes(),
                t.getSeconds()
            ].map(fmt).join(":") + "." +
            ("".padStart ?
                t.getMilliseconds().toString().padStart(3, "0") :
                t.getMilliseconds()
            ) + " " + tz;

        t = "[" + t + "]";

        msgs = msgs.map(e => e instanceof Error ?  e.toString() + "\n" + "TRACE: " + e.stack + "\n" : e);
        msgs = [t, level.padEnd ? level.padEnd(5, " ") : level].concat(msgs);

        // ONLY in browser env
        if (isBrowserEnv &&
            level === Logging.LEVEL.ERROR) {
            msgs = msgs.concat([
                "", // separator line
                "UA: " + navigator.userAgent,
                "URL: " + location.href
            ].join("\n"));
        }
        return msgs;
    }

    /**
     * last param as send to server flag
     * browser env ONLY
     * @ignore
     * @param msgs
     * @returns {boolean}
     */
    function hasSendFlagInLogParam (msgs) {
        let hasFlag = false;
        if (!isBrowserEnv) {
            return hasFlag;
        }

        // two params at least
        if (msgs.length > 1 &&
            typeof (msgs[msgs.length - 1]) === "boolean") {
            hasFlag = true;
        }

        return hasFlag;
    }

    /**
     * send logs to server
     * ONLY in browser env
     * @ignore
     * @param level
     * @param msgs
     * @param isSend {boolean} - optional flag for control send log to server
     */
    function sendLogToServer (level, msgs, isSend) {
        if (!isBrowserEnv) {
            return;
        }

        // Logging.SEND high priority
        if (Logging.SEND && isSend) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/p/log?_=" + new Date().getTime(), true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({
                level: level,
                // remove time & level tag
                msg: msgs.slice(2).join(" ")
            }));
        }
    }

    // global error handler
    // @see https://goo.gl/3L5oKg
    function errorHandler (msg, url, line, col, error) {
        // template script error may cause unexpected messages
        // e.g. Script error.
        msg = msg || "N/A";
        url = url || "N/A";
        error = error || {};
        const text = [
            "MSG: " + msg,
            "SCRIPT: " + url,
            "LINE: " + line,
            "COLUMN: " + col,
            "TRACE: " + error.stack || "N/A"
        ];

        logging.error(text.join("\n"));
        // return true prevents the firing of the default event handler.
        // script error url is N/A, enable default event handler for debug
        return logging.ddeh() !== null ? logging.ddeh() : (url !== "N/A");
    }

    logging = new Logging();
    return logging;
}));