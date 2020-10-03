let cfg = require("@grmn/doc/.jsdocrc");
cfg = JSON.parse(JSON.stringify(cfg));
cfg.source.include = [
    "fe/Functions.js",
    "fe/Logging.js"
];

module.exports = cfg;