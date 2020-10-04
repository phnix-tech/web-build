let cfg = require("@web-io/jsdoc/.jsdocrc");
cfg = JSON.parse(JSON.stringify(cfg));
cfg.source.include = [
  "fe/Functions.js",
  "fe/Logging.js"
];

module.exports = cfg;