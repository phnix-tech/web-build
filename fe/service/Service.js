/**
 * gs-common module path `fe/service/Service` or `dist/fe/service/Service` with babel translated
 * @module fe/service/Service
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

    /**
     * GSM web_token param support
     * @param url {string}
     * @return {string}
     * @ignore
     */
    function appendWebToken (url) {
        // GSM web_token param support
        const search = location.search.replace(/^\?/, "");
        if (search) {
            const params = search.split("&");
            for (let i = 0; i < params.length; i++) {
                const kv = params[i].split("=");
                if (kv.length === 2) {
                    const key = kv[0],
                        val = kv[1];
                    if (key === "web_token") {
                        url += `&${key}=${encodeURIComponent(val)}`;
                        break;
                    }
                }
            }
        }
        return url;
    }

    return {
        /**
         * fetch app variable from api `/p/appvariable`
         * @param success {function} optional success callback
         * @param error {function} optional error callback
         * @param opts {object} - model {AppVariable} if pass option with model
         * we will create the model instance with response data
         * @return {Promise<object|AppVariable> | null} Promise if supported otherwise use success/error callback instead
         */
        appVariable (success, error, opts) {
            if (typeof opts !== "object" &&
                typeof success === "object") {
                opts = success;
            }
            success = typeof success === "function" ? success : function () { };
            error = typeof error === "function" ? error : function () { };
            opts = opts || {};

            function cbk (_resolve, _reject) {
                resolve = _resolve;
                reject = _reject;
            }

            let resolve,
                reject,
                xhr = new XMLHttpRequest(),
                url = `/p/appvariable?_=${Date.now()}`,
                promise = typeof Promise !== "undefined" ? new Promise(cbk) : null;

            // GSM web_token param support
            url = appendWebToken(url);

            xhr.open("GET", url, true);
            xhr.send();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response
                        let appVar = xhr.response;
                        // convert to JSON object
                        if (typeof appVar === "string") {
                            appVar = JSON.parse(appVar);
                        }
                        if (opts.model) {
                            appVar = new opts.model(appVar);
                        }
                        success(appVar, xhr);
                        if (resolve) {
                            resolve(appVar, xhr);
                        }
                    } else {
                        error(xhr);
                        reject(xhr);
                    }
                }
            };

            return promise;
        }
    };
}));