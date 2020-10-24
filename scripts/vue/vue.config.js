const
  env = require("../env"),
  resolve = require("../resolve"),
  proxycfg = require("../proxycfg"),
  logFn = require("../logFn"),
  chainWebpack = require("./chainWebpack");

const config = require(resolve("./build/config"));

/**
 * @param {string} aliasPath
 * @param {string|undefined} apiPrefix - api请求前缀，默认`^/api/`
 * vue cli proxy path为正则表达式格式字符串
 * @see https://cli.vuejs.org/zh/config/
 */
module.exports = function ({
  aliasPath = resolve("./src"),
  apiPrefix = undefined
} = {}) {
  let devServer;
  if (env.isDev()) {
    const proxyTable = proxycfg.proxyTable({}, {
      dftApiPrefix: apiPrefix
    });
    logFn({proxyTable});

    // 如果无代理配置需指定proxy类型undefined，空对象类型报错
    // https://webpack.js.org/configuration/dev-server/#devserverproxy
    const proxy = (proxyTable && Object.keys(proxyTable).length > 0) ?
      {...proxyTable} : undefined;
    devServer = {
      proxy
    };
  }

  logFn({aliasPath});

  // https://webpack.js.org/configuration/output/#outputpublicpath
  const publicPath = config.publicPath;
  logFn({publicPath});

  const outputDir = resolve(`./dist/${config.outputName}`);
  logFn({outputDir});

  return {
    publicPath,
    outputDir,
    lintOnSave: false,
    configureWebpack: {
      resolve: {
        alias: {
          // 注意vue cli内置添加了`@`别名
          "@": aliasPath,
          "-": aliasPath
        }
      }
    },
    // https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7
    chainWebpack,
    // https://cli.vuejs.org/zh/guide/css.html#css-modules
    css: {
      requireModuleExtension: true,
      loaderOptions: {
        css: {
          ...(
            env.isProd() ? {
              modules: {
                // https://github.com/webpack-contrib/css-loader#localidentname
                // 自定义生产环境样式名称格式
                localIdentName: "[hash:base64]"
              }
            } : {}
          )
        }
      }
    },
    devServer
  };
};
