/**
 * export new Functions, functions module define common function must not depends on any other module
 * @namespace fe/Functions
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

    const
        /**
         *
         * @ignore
         * @constructor
         */
        Functions = function () { },
        isBrowserEnv = typeof window !== "undefined" && window;

    (function () {

        /**
         * iframe environment check
         * @memberOf fe/Functions
         * @method isIFrameEnv
         * @returns {boolean}
         */
        this.isIFrameEnv = function () {
            let isIfm = false;
            if (isBrowserEnv) {
                isIfm = window.top && window.top !== window;
            }
            return isIfm;
        };

        /**
         * check arbitrary windows are the same origin or not
         * @memberOf fe/Functions
         * @method isSameOrigin
         * @returns {boolean}
         */
        this.isSameOrigin = function () {
            let isSame = true,
                wnd = arguments[0];
            for (let i = 1; i < arguments.length; i++) {
                const wnd1 = arguments[i];
                try {
                    if (wnd.location.protocol !== wnd1.location.protocol ||
                        wnd.location.host !== wnd1.location.host) {
                        isSame = false;
                        break;
                    }
                } catch (e) {
                    // if location property is not accessible THEN cross-origin exception may be throws
                    isSame = false;
                    break;
                }
            }
            return isSame;
        };

        /**
         * @memberOf fe/Functions
         * @method getURLParameter
         * @param {string} name - query string key
         * @param {string} url - optional, if not given use location.search
         * @returns {string|null} if not given key return null
         * @see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
         * @description query string: ?f=1&foo=&foo1
         * get foo empty string not null, (present with empty value)
         * get foo1 empty string not null, (present with no value)
         * get foo2 null (absent)
         */
        this.getURLParameter = function (name, url) {
            url = url || location.search;
            const regexp = new RegExp("[?|&]" + name + "(=([^&;]*)|&|#|;|$)"),
                group = regexp.exec(url);
            if (!group) {
                return null;
            }
            if (!group[2]) {
                return "";
            }
            return decodeURIComponent(group[2].replace(/\+/g, "%20"));
        };

        /**
         * @method replaceURLParameter
         * @memberOf fe/Functions
         * @param name
         * @param val
         * @param url
         * @returns {*} absolute url without hostname
         */
        this.replaceURLParameter = function (name, val, url) {
            url = url || (location.pathname + location.search);
            if (url.indexOf("?") === -1) {
                url += "?";
            }
            let params = name + "=" + encodeURIComponent(val);
            if (this.getURLParameter(name, url) !== null) {
                url = url.replace(new RegExp("([?&])" + name + "=[^&]*"), "$1" + params);
            } else {
                if (/\?$/.test(url)) {
                    url += params;
                } else {
                    url += ("&" + params);
                }
            }
            return url;
        };

        /**
         * @memberOf fe/Functions
         * @method removeURLParameter
         * @param {string} name
         * @param {string} url
         * @return {string}
         */
        this.removeURLParameter = function (name, url) {
            url = url || (location.pathname + location.search);
            if (this.getURLParameter(name, url) !== null) {
                url = url.replace(new RegExp(name + "=[^&]*&?"), "");
                // 删除尾部无值参数
                url = url.replace(new RegExp("[?&]" + name + "$"), "");
                // 删除中间无值参数
                url = url.replace(new RegExp("([?&])" + name + "&"), "$1");
            }
            // 去除尾部多余的?&
            url = url.replace(new RegExp("[?&]+$"), "");
            return url;
        };

        /**
         * @memberOf fe/Functions
         * @method appendQueryString
         * @param {string} url
         * @param {string} qs
         * @return {string}
         */
        this.appendQueryString = function (url, qs) {
            // qs contains question mark ?
            if (url.indexOf("?") === -1) {
                url += qs;
            } else if (qs) {
                if (url.indexOf("&") === -1 || !/&$/.test(url)) {
                    url += "&";
                }
                url += qs.substring(1);
            }
            return url;
        };

        /**
         * set browser cookie
         * @memberOf fe/Functions
         * @method setCookie
         * @param cookieName {String|Undefined}
         * @param value {String|Undefined}
         * @param expireTime {String|Undefined}
         */
        function setCookie (cookieName, value, expireTime) {
            let now = new Date();
            now.setTime(now.getTime() + 10 * 365 * 86400000);
            expireTime = expireTime || now.toGMTString();
            document.cookie = cookieName + "=" + value + (expireTime ? ";expires=" + expireTime : "") + ";path=/;domain=" + location.hostname;
            return this;
        }

        /**
         * delete browser cookie by name
         * @memberOf fe/Functions
         * @method deleteCookie
         * @param cookieName {String|Undefined}
         */
        function deleteCookie (cookieName) {
            document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=" + location.hostname;
            return this;
        }

        /**
         * get browser cookie
         * @memberOf fe/Functions
         * @method getCookie
         * @param cookieName {String}
         * @returns {*}
         */
        function getCookie (cookieName) {
            let name = cookieName + "=",
                cookieAry = document.cookie.split(";"),
                cookie,
                i;
            for (i = 0; i < cookieAry.length; i++) {
                cookie = cookieAry[i];
                while (cookie.charAt(0) === " ") {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(name) === 0) {
                    cookie = cookie.substring(name.length, cookie.length);
                    return cookie;
                }
            }
            return "";
        }

        this.setCookie = setCookie;
        this.getCookie = getCookie;
        this.deleteCookie = deleteCookie;

        /**
         * encode number to string by ascii
         * @memberOf fe/Functions
         * @method encodeStr
         * @param {string} code
         * @returns {string}
         */
        this.encodeStr = function (code) {
            if (!code) {
                return "";
            }

            let charAry = code.toString().split(""),
                encodeStr = "YIR-",
                str;

            for (str in charAry) {
                encodeStr += String.fromCharCode(97 + parseInt(str)) + String.fromCharCode(97 + parseInt(str) + 5);
            }

            return encodeStr;
        };

        /**
         * decode string to number by ascii
         * @memberOf fe/Functions
         * @method decodeStr
         * @param {string} code
         * @returns {string}
         *  */
        this.decodeStr = function (code) {
            if (!code) {
                return "";
            }

            let decodeStr = "",
                idx,
                codes;
            codes = code.toString().replace("YIR-", "").split("");
            for (idx in codes) {
                if (!(idx % 2)) {
                    decodeStr += (codes[idx].charCodeAt(0) - 96);
                }
            }
            return decodeStr;
        };

        (function () {
            /**
             * browser detection, borrowed from jquery @see http://api.jquery.com/jquery.browser/
             * @memberOf fe/Functions
             * @param ua {string}
             * @returns {object}
             */
            function browserDetect (ua) {
                ua = ua || "";
                ua = ua.toLowerCase();
                let match =
                        // MS Edge UA e.g.
                        // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393
                        // NOTE EDGE UA has Chrome word
                        /(edge)[ /]([\w.]+)/.exec(ua) ||
                        /(chrome)[ /]([\w.]+)/.exec(ua) ||
                        /(webkit)[ /]([\w.]+)/.exec(ua) ||
                        /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
                        /(msie) ([\w.]+)/.exec(ua) ||
                        /(trident)[ /]([\w.]+)/.exec(ua) ||
                        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                        [],
                    matched,
                    start,
                    limit,
                    browser;

                matched = {
                    browser: match[1] || "",
                    version: match[2] || "0"
                };

                /* new trident is for ie 11*/
                browser = {};
                if (matched.browser) {
                    browser[matched.browser] = true;
                    browser.version = matched.version;
                    // ie11: Trident/7.0
                    if (browser.trident) {
                        // treat ie 11 as msie
                        browser["msie"] = true;
                        browser.version = parseFloat(browser.version) + 4;
                        browser.version += ".0";
                    }
                }
                // EDGE is webkit?
                // Chrome is Webkit, but Webkit is also Safari.
                if (browser.edge || browser.chrome) {
                    browser.webkit = true;
                } else if (browser.webkit) {
                    browser.safari = true;
                }

                // extend customize property
                if ((browser.msie || browser.trident) && browser.version) {
                    start = 0;
                    limit = 1;
                    if (browser.version.length > 3) {
                        limit = 2;
                    }
                    browser["ie" + String(browser.version).substring(start, limit)] = true;
                }
                return browser;
            }

            /**
             * @namespace fe/Functions.browser
             * @description browser & version object, see jquery.browser
             * we may extend our customize property, e.g. ie8, ie9
             */
            this.browser = (isBrowserEnv ? browserDetect(navigator.userAgent) : {}) || {};
            // Credits: http://goo.gl/SfjfGz

            /**
             * check if mobile,Credits: http://goo.gl/SfjfGz
             * @memberOf fe/Functions.browser
             * @method isMobile
             */
            this.browser.isMobile = function (ua) {
                ua = ua || navigator.userAgent;
                const flag = new RegExp("(android|bb\\d+|meego).+mobile|avantgo|bada/|blackberry|blazer|compal|elaine|fennec|hiptop|" +
                        "iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|" +
                        "palm( os)?|phone|p(ixi|re)/|plucker|pocket|psp|series(4|6)0|symbian|treo|up.(browser|link)|" +
                        "vodafone|wap|windows (ce|phone)|xda|xiino", "i").test(ua) ||
                new RegExp("1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|" +
                        "an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|" +
                        "br(e|v)w|bumb|bw-(n|u)|c55/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|" +
                        "devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|" +
                        "g1 u|g560|gene|gf-5|g-mo|go(.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|" +
                        "ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|" +
                        "iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|/(k|l|u)|50|54|" +
                        "-[a-w])|libw|lynx|m1-w|m3ga|m50/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|" +
                        "de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|" +
                        "tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|" +
                        "pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55/|" +
                        "sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|" +
                        "sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|" +
                        "tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|" +
                        "voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-")
                    .test((ua.length >= 5 ? ua.substr(0, 4) : ""));
                return flag || this.isiOS.apply(this, arguments) || this.isAndroid.apply(this, arguments) ||
                    this.isWechat.apply(this, arguments) || this.isWeibo.apply(this, arguments);
            };

            /**
             * @memberOf fe/Functions.browser
             * @method isiOS
             */
            this.browser.isiOS = function (ua) {
                ua = ua || navigator.userAgent;
                return /ip(hone|od|ad)/i.test(ua);
            };

            /**
             * @memberOf fe/Functions.browser
             * @method isAndroid
             */
            this.browser.isAndroid = function (ua) {
                ua = ua || navigator.userAgent;
                return /(android|bb\d+|meego).+mobile|Android/i.test(ua);
            };

            /**
             * @memberOf fe/Functions.browser
             * @method isWechat
             */
            this.browser.isWechat = function (ua) {
                ua = ua || navigator.userAgent;
                return /micromessenger/i.test(ua);
            };

            /**
             * @memberOf fe/Functions.browser
             * @method isWeibo
             */
            this.browser.isWeibo = function (ua) {
                ua = ua || navigator.userAgent;
                return /weibo/i.test(ua);
            };

            /**
             * @memberOf fe/Functions.browser
             * @method isGsmIos
             */
            this.browser.isGsmIos = function (ua) {
                ua = ua || navigator.userAgent;
                // GSM iOS UA e.g.
                // gccm/2.5.0.3 (iOS 11.1.2; iPhone 7 Plus; 32BDF1DC-5010-4215-AB16-74D3E9F5F9E1) Alamofire/4.2
                // GSM iOS will change UA keyword gccm to com.garmin.gccm
                return this.isiOS(ua) && /com\.garmin\.gccm/i.test(ua);
            };

            /**
             * @memberOf fe/Functions.browser
             * @method isGsmAndroid
             */
            this.browser.isGsmAndroid = function (ua) {
                ua = ua || navigator.userAgent;
                // GSM Android UA e.g.
                // Dalvik/2.1.0 (Linux; U; Android 7.0; MI 5s MIUI/V9.6.1.0.NAGCNFD);com.garmin.android.apps.gccm 2.6.1;device-id : 82216455-5cff-4a5a-a9a4-f9f171ea6cc6R ;User-id : 6023
                return this.isAndroid(ua) && /com\.garmin\.android\.apps\.gccm/i.test(ua);
            };

            /**
             * @memberOf fe/Functions.browser
             * @method isGSM
             */
            this.browser.isGSM = function (ua) {
                ua = ua || navigator.userAgent;
                return this.isGsmIos(ua) || this.isGsmAndroid(ua);
            };

            if (isBrowserEnv) {
                /**
                 * @memberOf fe/Functions
                 * @member isMobile
                 */
                this.isMobile = this.browser.isMobile();
                /**
                 * @memberOf fe/Functions
                 * @member isiOS
                 */
                this.isiOS = this.browser.isiOS();
                /**
                 * @memberOf fe/Functions
                 * @member isAndroid
                 */
                this.isAndroid = this.browser.isAndroid();
                /**
                 * @memberOf fe/Functions
                 * @member isWechat
                 */
                this.isWechat = this.browser.isWechat();
            }

            this.browserDetect = browserDetect;

            /**
             * @memberOf fe/Functions
             * @method os
             * @param {string} ua
             * @returns {string}
             */
            this.os = function (ua) {
                ua = ua || navigator.userAgent;
                // @see http://dwz.cn/4zLzQz
                let osKeyVal = {
                        "Windows XP": "(Windows NT 5.1)|(Windows XP)",
                        "Windows Server 2003": "(Windows NT 5.2)",
                        "Windows Vista": "(Windows NT 6.0)",
                        "Windows 7": "(Windows NT 6.1)",
                        "Windows 8": "(Windows NT 6.2)",
                        "Windows 10": "(Windows NT 10.0)",
                        "Linux": "(Linux)|(X11)",
                        "Mac OS": "(Mac_PowerPC)|(Macintosh)",
                        "OS/2": "OS/2",
                        "Open BSD": "Open BSD"
                    }, key;
                for (key in osKeyVal) {
                    if (new RegExp(osKeyVal[key], "i").test(ua)) {
                        return key;
                    }
                }
                return ua;
            };

            /**
             * @memberOf fe/Functions
             * @method browserTxt
             * @param {string} ua
             * @returns {string}
             */
            this.browserTxt = function (ua) {
                ua = ua || navigator.userAgent;
                let txt = "N/A",
                    browser = null;
                if (ua) {
                    txt = ua;
                    browser = this.browserDetect(ua);

                    if (browser.edge) {
                        txt = "Edge";
                    }
                    else if (browser.chrome) {
                        txt = "Chrome";
                    } else if (browser.safari) {
                        txt = "Safari";
                    } else if (browser.msie) {
                        txt = "IE";
                    } else if (browser.mozilla) {
                        txt = "Firefox";
                    }
                    if (browser.version) {
                        txt += " " + browser.version;
                    }
                }
                return txt;
            };

            /**
             * @memberOf fe/Functions
             * @method osTxt
             * @param {string} ua
             * @returns {string}
             */
            this.osTxt = function (ua) {
                ua = ua || navigator.userAgent;
                let txt = "N/A";
                if (ua) {
                    if (this.browser.isMobile(ua)) {
                        txt = ua;
                        if (this.browser.isiOS()) {
                            txt = "iOS";
                        } else if (this.browser.isAndroid()) {
                            txt = "Android";
                        }
                    } else {
                        txt = this.os(ua);
                    }
                }
                return txt || "N/A";
            };
        }.call(this));

        /**
         * @memberOf fe/Functions
         * @method uuid
         * @param {string} prefix
         * @returns {string}
         */
        this.uuid = function (prefix) {
            prefix = prefix || "";
            const d = new Date().getTime();
            return prefix + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                const r = (d + Math.random() * 16) % 16 | 0;
                return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
            });
        };

        /**
         * email check regular expression
         * @memberOf fe/Functions
         * @method isValidEmail
         * @param {string} email
         * @see http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
         * @return {boolean}
         * @example Functions.isValidEmail("12345@163.com")
         */
        this.isValidEmail = function (email) {
            return /^(([^<>()[\]\\.,;:\s@%!~"]+(\.[^<>()[\]\\.,;:\s@%!~"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        };

        /**
         * check whether input is valid url
         * @memberOf fe/Functions
         * @method isUrlFormat
         * @param url {string}
         * @returns {boolean}
         */
        this.isUrlFormat = function (url) {
            return !!url.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig);
        };

        /**
         * check whether input is valid domain
         * @memberOf fe/Functions
         * @method isDomainFormat
         * @param domain {string}
         * @returns {boolean}
         */
        this.isDomainFormat = function (domain) {
            return !!domain.match(/^((?:(?:(?:\w[.\-+]?)*)\w)+)((?:(?:(?:\w[.\-+]?){0,62})\w)+)\.(\w{2,6})$/);
        };
    }.call(Functions.prototype));

    return new Functions;
}));
