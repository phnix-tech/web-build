// react-scripts/config/webpack.config.js
// 自定义生产环境样式名称格式
module.exports = function (rules) {
  rules
    .filter(Boolean)
    .forEach(styleRule => {
      styleRule.use
        .filter(loader => {
          return loader.options && loader.options.modules;
        })
        .forEach(loader => {
          const {modules} = loader.options;
          const {getLocalIdent} = modules;
          if (getLocalIdent) {
            delete modules.getLocalIdent;
            modules.localIdentName = "[hash:base64]";
          }
        });
    });
};