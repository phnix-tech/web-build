"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd&&define(e)}(function(){function e(e){var o=location.search.replace(/^\?/,"");if(o)for(var n=o.split("&"),t=0;t<n.length;t++){var f=n[t].split("=");if(2===f.length){var i=f[0],r=f[1];if("web_token"===i){e+="&"+i+"="+encodeURIComponent(r);break}}}return e}return{appVariable:function(o,n,t){function f(e,o){i=e,r=o}"object"!==(void 0===t?"undefined":_typeof(t))&&"object"===(void 0===o?"undefined":_typeof(o))&&(t=o),o="function"==typeof o?o:function(){},n="function"==typeof n?n:function(){},t=t||{};var i=void 0,r=void 0,p=new XMLHttpRequest,u="/p/appvariable?_="+Date.now(),d="undefined"!=typeof Promise?new Promise(f):null;return u=e(u),p.open("GET",u,!0),p.send(),p.onreadystatechange=function(){if(4===p.readyState)if(200===p.status){var e=p.response;"string"==typeof e&&(e=JSON.parse(e)),t.model&&(e=new t.model(e)),o(e,p),i&&i(e,p)}else n(p),r(p)},d}}});