let cfg = require("@grmn/doc/.jsdocrc");
cfg = JSON.parse(JSON.stringify(cfg));
cfg.source.include = [
    "fe/Functions.js",
    "fe/Logging.js",
    "fe/model/AppVariable.js",
    "fe/service/Service.js",
    "fe/GSMJsBridge.js",
    "fe/common/util.js"
];

module.exports = cfg;