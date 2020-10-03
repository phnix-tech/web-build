(function (factory) {
    "use strict";
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    }
}(function () {
    "use strict";

    // base JS language extension

    String.prototype.trim = String.prototype.trim || function () {
        return this.replace(/^\s+|\s+$/gm, "");
    };

    /**
     * fix IE Array.prototype.find issue
     * @see https://goo.gl/ilx405
     */
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, "find", {
            value: function (predicate) {
                if (this === null || this === undefined) {
                    throw new TypeError("\"this\" is null or not defined");
                }

                let o = new Object(this),
                    len = o.length >>> 0,
                    thisArg = arguments[1],
                    k = 0,
                    kValue;

                if (typeof predicate !== "function") {
                    throw new TypeError("predicate must be a function");
                }

                while (k < len) {
                    kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    k++;
                }

                return undefined;
            }
        });
    }

    const isBrowserEnv = typeof window !== "undefined" && window;

    // @see https://goo.gl/6fRFvk
    // location.origin issue <= IE10
    if (isBrowserEnv && !window.location.origin) {
        // Some browsers (mainly IE) does not have this property, so we need to build it manually...
        window.location.origin = window.location.protocol + "//" + window.location.hostname +
            (window.location.port ? (":" + window.location.port) : "");
    }
}));