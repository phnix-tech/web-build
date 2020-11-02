const env = require("../env");

/**
 * 配置html-webpack-plugin压缩index.html css & js
 * @see https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6%E9%80%89%E9%A1%B9
 * @param config
 */
function htmlWebpackPlugin (config) {
  config
    .plugin("html")
    .tap(args => {
      const minify = args && args[0] && args[0].minify;
      if (minify && env.isProd()) {
        // https://github.com/kangax/html-minifier#options-quick-reference
        Object.assign(minify, {
          minifyCSS: true,
          minifyJS: true
        });
      }
      return args;
    });
}

/**
 * @see https://github.com/neutrinojs/webpack-chain
 * @param config
 */
module.exports = function chainWebpack (config) {
  htmlWebpackPlugin(config);
};