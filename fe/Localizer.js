define([
    "jquery"
], function (jQuery) {
    "use strict";

    /**
     * Class which provides localization. Wraps a jQuery plugin which will fetch the corresponding properties
     * file from the server that us used to provide the correct translation.
     */
    return {
        /**
         * Initializes the jQuery internationalization plugin and sets the locale to the given value. May be
         * called repeatedly in order to change the language after the fact.
         */
        setLocale: function (locale, mobileWebVersion) {
            let opts = locale,
                name = ["Messages"],
                path = "/bundle/",
                language = locale,
                // @type {boolean|string}, cache translation files or not
                // you can also pass a version number string to cache files by period
                cache = mobileWebVersion;
            // option args provided
            if (Object.prototype.toString.call(opts) === "[object Object]" &&
                arguments.length === 1) {
                name = opts.name || name;
                path = opts.path || path;
                language = opts.language || opts.locale || language;
                cache = opts.cache || cache;
            }
            // uniform tail slash
            if (!/\/$/.test(path)) {
                path += "/";
            }

            jQuery.i18n.properties({
                name: name,
                path: path,
                mode: "map",
                language: language,
                cache: cache
            });
        },

        /**
         * Given a key, provides the correct translation.
         *
         * @param keyName the key to retrieve.
         */
        /* eslint-disable no-unused-vars */
        localize: function (keyName) {
            return jQuery.i18n.prop.apply(jQuery.i18n.prop, arguments);
        }
        /* eslint-enable no-unused-vars */
    };
});