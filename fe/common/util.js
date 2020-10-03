/**
 * gs-common module path `fe/common/util` or `dist/fe/common/util with babel translated
 * @module fe/common/util
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

    const SERVICE_REGION = [
        "shixda-gsint02.garmin.com",
        "sportstest.garmin.com.tw",
        "sports.garmin.com"
    ].indexOf(location.hostname) !== -1 ? "GLOBAL" : "CN";

    return {
        /**
         * Garmin sports server service region, detected by hostname, possible value CN|GLOBAL
         * @type {string}
         */
        SERVICE_REGION: SERVICE_REGION,
        /**
         * Global service region check method
         * @return {boolean}
         */
        isGlobal: function () {
            return this.SERVICE_REGION === "GLOBAL";
        },
        /**
         * Get default language if the given language not supported
         * CN: zh_CN, GLOBAL: en
         * @param lang {string} language key
         * @return {string}
         */
        dftLang: function (lang) {
            return /^(en|zh_CN|zh_TW|ja|ko|th)?$/.test(lang) ? lang : (this.isGlobal() ? "en" : "zh_CN");
        },

        /**
         * get iframe embedded SPA page root el scroll height
         * used for iframe's parent adjust iframe height fit content area
         * @param id {string} root el id, `app-place-holder` as default id
         * @return {number}
         */
        windowScrollHeight: function (id) {
            // assume app-place-holder as root el id
            const appEl = document.getElementById(id || "app-place-holder");

            return (appEl && appEl.scrollHeight) ||
                Math.max(document.documentElement.offsetHeight || 0,
                    document.documentElement.scrollHeight || 0,
                    document.body.scrollHeight || 0);
        }
    };
}));