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
     * User model class
     * @see https://confluence.garmin.com/display/CDMAPAPP/Web+Common+Dto#WebCommonDto-UserLightDto
     * @class
     */
    class User {
        /**
         *
         * @param props {object} appVariable.userVariable
         * @param user {object} appVariable.user
         */
        constructor (props = {}, user = {}) {
            props = props || {};
            user = user || {};
            this._id = (props.gccUserId !== undefined ? props.gccUserId : user.gccUserId) || -1;
            this._userName = props.userName !== undefined ? props.userName : user.userName;
            this._fullName = props.fullName !== undefined ? props.fullName : user.fullName;
            this._imageUrl = props.imageUrl !== undefined ? props.imageUrl : user.imageUrl;
            this._isSystemAdmin = props.isSystemAdmin !== undefined ? props.isSystemAdmin : user.isSystemAdmin;
            this._isSuperAdmin = props.isSuperAdmin !== undefined ? props.isSuperAdmin : user.isSuperAdmin;
            this._isCertifiedCoach = props.isCertifiedCoach !== undefined ? props.isCertifiedCoach : user.isCertifiedCoach;
            this._isGsAssistant = props.isGsAssistant !== undefined ? props.isGsAssistant : user.isGsAssistant;
            this._isBackdoorByAdmin = props.isBackdoorByAdmin !== undefined ? props.isBackdoorByAdmin : user.isBackdoorByAdmin;
            this._countryCode = props.countryCode !== undefined ? props.countryCode : user.countryCode;
            this._language = props.language !== undefined ? props.language : user.language;
            this._lang = props.lang !== undefined ? props.lang : user.lang;
            // @type {object}
            this._user = user;
            // merge props(userVariable) & user
            this._mergedUser = {};
            Object.keys(props).forEach(key => {
                this._mergedUser[key] = props[key];
            });
            Object.keys(user).forEach(key => {
                this._mergedUser[key] = user[key];
            });
        }

        /**
         * gcc user id
         * @returns {number}
         */
        id () {
            return this._id;
        }

        /**
         * check user has login or not
         * @returns {boolean}
         */
        isAuth () {
            return this.id() > 0;
        }

        /**
         * same user check by gcc user id
         * @param userId {number}
         * @return {boolean}
         */
        isSelf (userId) {
            return this.id() === userId;
        }
        /**
         * user nick name same as full name
         * @returns {string}
         */
        name () {
            return this._fullName;
        }

        /**
         * alias as name method
         * @return {string}
         */
        fullName () {
            return this.name.apply(this, arguments);
        }
        /**
         * user name is unique name
         * e.g. email JEFY.LEE@GARMIN.COM
         * @returns {string}
         */
        userName () {
            return this._userName;
        }
        /**
         * user avatar image full url
         * e.g. https://shixda-gsint01.garmin.com/images/profile/14--40b848f0-fd8b-4265-b9c1-b255b5e3ffcb.jpg
         * @returns {string}
         */
        imgUrl () {
            return this._imageUrl;
        }
        /**
         * language code
         * e.g. zh_CN, zh_TW, en, ja, ko, th
         * @return {string}
         */
        language () {
            return this._language;
        }
        /**
         * html lang attribute
         * e.g. zh-CN, zh-TW
         * @return {string}
         */
        lang () {
            return this._lang;
        }
        /**
         * localizer properties file name
         * NOTE: english locale without language code
         * @returns {string}
         */
        propertiesName () {
            let filename = "Messages";
            if (this.language() !== "en") {
                filename += ("_" + this.language());
            }
            filename += ".properties";
            return filename;
        }

        /**
         * SPA index template may be integrated into JSP or nodejs development server
         * the backend will pass context data to template in these cases
         * the global appvariable will be injected with correct value also
         * e.g.
         * var __appVariable = (function () {
         *     return {
         *         user: {
         *             gccUserId: "${appVariable.userVariable.gccUserId}",
         *             language: "${appVariable.userVariable.language}"
         *         }
         *      };
         * }());
         * @return {boolean}
         */
        isInjected () {
            return !/^\${.+}/.test(this.id().toString());
        }
        toString () {
            return JSON.stringify(this._mergedUser);
        }
    }

    /**
     * Garmin SSO related properties class
     * @class
     */
    class SSO {
        constructor (props = {}) {
            props = props || {};
            this._gauthJSUrl = props.gauthJSUrl;
            this._gauthHost = props.gauthHost;
            this._callBackWebHostUrl = props.callBackWebHostUrl;
            this._redirectAfterAccountLoginUrl = props.ssoRedirectAfterAccountLoginUrl;
            this._redirectAfterAccountCreationUrl = props.ssoRedirectAfterAccountCreationUrl;
        }
        callBackWebHostUrl (callBackWebHostUrl) {
            if (arguments.length === 0) {
                return this._callBackWebHostUrl;
            }
            this._callBackWebHostUrl = callBackWebHostUrl;
            return this;
        }
        redirectAfterAccountLoginUrl (redirectAfterAccountLoginUrl) {
            if (arguments.length === 0) {
                return this._redirectAfterAccountLoginUrl;
            }
            this._redirectAfterAccountLoginUrl = redirectAfterAccountLoginUrl;
            return this;
        }
        redirectAfterAccountCreationUrl (redirectAfterAccountCreationUrl) {
            if (arguments.length === 0) {
                return this._redirectAfterAccountCreationUrl;
            }
            this._redirectAfterAccountCreationUrl = redirectAfterAccountCreationUrl;
            return this;
        }
    }

    /**
     * GS SPA html basic data class
     * @class
     */
    class HTMLVariable {
        constructor (props = {}) {
            props = props || {};
            this._title = props.title;
            this._keywords = props.keywords;
            this._description = props.description;
            this._appBuildPrefix = props.appBuildPrefix;
            this._styleHref = props.styleHref;
            this._rwdStyleHref = props.rwdStyleHref;
            this._jqueryUICss = props.jqueryUICss;
            this._requireJsMain = props.requireJsMain;
            this._requireJsBaseUrl = props.requireJsBaseUrl;
            this._ogp = props.ogp;
        }

        /**
         * html title
         * @return {string}
         */
        title () {
            return this._title;
        }
    }

    /**
     * AppVariable just like GCC/web/web@main/router/AppContext
     * it provides basic information of the website & current user if user has login
     * @see https://confluence.garmin.com/display/CDMAPAPP/GS+-+Web+App+Variable
     * @class
     */
    class AppVariable {
        /**
         * create AppVariable instance
         * we commonly pass `/p/appvariable` response data to construct AppVariable
         * @param props {object}
         */
        constructor (props = {}) {
            props = props || {};
            this._appVariable = props;
            this._user = new User(props.userVariable, props.user);
            this._sso = new SSO(props);
            this._html = new HTMLVariable(props);
            this._isDevelopment = props.isDevelopment;
            this._debug = props.debug;
            this._env = props.env;
            this._webVersion = props.webVersion;
            this._serviceRegion = props.serviceRegion;
            this._countryCode = props.countryCode;
            this._disableWebstore = props.disableWebstore;
            this._webpackDev = props.webpackDev;
            this._prefix = props.prefix;
            this._baiduMapKey = props.baiduMapKey;
            this._googleMapKey = props.googleMapKey;
        }

        /**
         *
         * @returns {User}
         */
        user () {
            return this._user;
        }

        /**
         *
         * @returns {SSO}
         */
        sso () {
            return this._sso;
        }

        /**
         *
         * @returns {HTMLVariable}
         */
        html () {
            return this._html;
        }
        /**
         * template use raw app variable
         * so call this method get plain app variable pass to template context
         * @returns {object}
         */
        appVariable () {
            return this._appVariable;
        }

        /**
         * get service region, possible value CN|GLOBAL
         * @return {string}
         */
        serviceRegion () {
            return this._serviceRegion;
        }

        /**
         * CN service region check
         * @return {boolean}
         */
        isCN () {
            return this.serviceRegion() === "CN";
        }
        /**
         * GLOBAL service region check
         * @return {boolean}
         */
        isGlobal () {
            return this.serviceRegion() === "GLOBAL";
        }
        /**
         * get endpoint prefix, /public otherwise /proxy if user has signin state
         * @return {string}
         */
        prefix () {
            return this._prefix;
        }

        /**
         * backend server environment flag
         * ENUM: null|dev|inte|test|stag|prod
         * @return {string}
         */
        env () {
            return this._env;
        }
        /**
         * NOTE debug/isDevelopment/env/logging differences
         * is development will impact some enviable, e.g. SSO/GC host/third party test/prod env
         * debug impact front-end minified js/css/images files or not and logging
         * @return {boolean}
         */
        debug () {
            return this._debug;
        }
        /**
         * logging default strategy
         * this.debug() ? true : false;
         * @returns {boolean}
         */
        logging () {
            return !!this.debug();
        }

        /**
         * web release version datetime string, e.g. 20190404131313
         * @return {string}
         */
        webVersion () {
            return this._webVersion;
        }

        /**
         * google map key
         * @return {string}
         */
        googleMapKey () {
            return this._googleMapKey;
        }

        /**
         * baidu map key
         * @return {string}
         */
        baiduMapKey () {
            return this._baiduMapKey;
        }

        /**
         * google analysis key
         * @return {string}
         */
        gaKey () {
            let env = this.env(),
                idGA;
            switch (env) {
                case "prod":
                    idGA = "2";
                    break;
                case "test":
                    idGA = "1";
                    break;
                default:
                    idGA = "3";
                    break;
            }
            return "UA-67364141-" + idGA;
        }

        /**
         * baidu tongji key
         * @return {string}
         */
        baiduTongjiKey () {
            let env = this.env(),
                isGlobal = this.isGlobal(),
                bdKey;
            switch (env) {
                case "prod":
                    bdKey = isGlobal ? "234973ed33d152598aa8bfac8c46cfdb" : "d21b03f7a4855c680c2ac791c57316a2";
                    break;
                case "test":
                    bdKey = isGlobal ? "5f48cb3260f4092635ee1e56ca97ae0e" : "1c2a936653109cf8fe8dac6e728b1782";
                    break;
                default:
                    // CN integration server domain key
                    bdKey = "acde108e5e98e1243ba0d985953d1795";
                    break;
            }
            return bdKey;
        }
        /**
         * default language by service region
         * @return {string}
         */
        defaultLanguage () {
            let lang = "en";
            if (this.isCN()) {
                lang = "zh_CN";
            }
            return lang;
        }
    }

    /**
     * gs-common module path `fe/model/AppVariable` or `dist/fe/model/AppVariable` with babel translated
     * @module fe/model/AppVariable
     * @type {AppVariable}
     */
    return AppVariable;
}));