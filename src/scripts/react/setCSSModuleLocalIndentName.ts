import type {Rule} from "../types/WebpackConfig";

// react-scripts/config/webpack.config.js
// 自定义生产环境样式名称格式
export = function (rules: (Rule | undefined)[]) {
  rules
    .filter(Boolean)
    .forEach(styleRule => {
      if (!styleRule) {
        return;
      }

      styleRule.use
        .filter(loader => {
          return loader.options && loader.options.modules;
        })
        .forEach(loader => {
          if (!loader.options) {
            return;
          }

          const {modules} = loader.options;
          if (!modules) {
            return;
          }

          const {getLocalIdent} = modules;
          if (getLocalIdent) {
            delete modules.getLocalIdent;
            modules.localIdentName = "[hash:base64]";
          }
        });
    });
};