const
  paths = require("react-scripts/config/paths"),
  {logging} = require("../web-build"),
  resolve = require("../resolve"),
  proxycfg = require("../proxycfg"),
  env = require("../env"),
  logFn = require("../logFn"),
  prepareUrls = require("./prepareUrls");

const bldCfg = require(resolve("./build/config"));
const {publicPath} = bldCfg;

// 修改CRA build输出目录
// https://segmentfault.com/q/1010000019904178/
const outputDir = resolve(`dist/${bldCfg.outputName}`);
paths.appBuild = outputDir;

const setCSSModuleLocalIndentName = require("./setCSSModuleLocalIndentName");
function webpack (config) {
  // 解决tsconfig paths别名丢失问题
  // 添加IDE对于模块别名智能识别支持
  // https://blog.csdn.net/chrislincp/article/details/97312235
  // https://www.typescriptlang.org/v2/en/tsconfig#paths
  const aliasPath = resolve("./src");
  logFn({aliasPath});
  config.resolve.alias = {
    "@": aliasPath,
    "-": aliasPath
  };

  if (config.module && config.module.rules) {
    // 删除react-scripts eslint loader，我们使用自己的eslint配置
    // see `react-scripts/config/webpack.config.js`
    const {rules} = config.module;
    rules.splice(1, 1);

    // 开启babelrc
    // https://blog.csdn.net/weixin_39836173/article/details/86110011
    // https://github.com/ant-design/babel-plugin-import
    const rule = config.module.rules[1];
    const babelLoader = rule.oneOf && rule.oneOf[1];

    if (babelLoader && babelLoader.options) {
      babelLoader.options.babelrc = true;
    }

    if (env.isProd()) {
      // react-scripts/config/webpack.config.js
      const cssModuleRule = rule.oneOf && rule.oneOf[4];
      const sassModuleRule = rule.oneOf && rule.oneOf[6];
      setCSSModuleLocalIndentName([cssModuleRule, sassModuleRule]);
    }
  }

  // 使用相对路径引用资源文件, 默认为`/`
  if (publicPath) {
    config.output.publicPath = publicPath;
  }
  logFn({publicPath});
  logFn({outputDir});

  return config;
}

prepareUrls(publicPath);

/**
 * create-react-app配置重写
 * @param {string|undefined} apiPrefix - api请求前缀，默认`/api`
 * @see https://github.com/timarney/react-app-rewired
 */
module.exports = function ({
  apiPrefix = undefined
} = {}) {
  return {
    // The Webpack config to use when compiling your react app for development or production.
    webpack,

    devServer (configFunction) {
      // 统一vue config proxy格式
      if (apiPrefix && !/^\^/.test(apiPrefix)) {
        apiPrefix = "^" + apiPrefix;
      }
      const proxyTable = proxycfg.proxyTable({}, {
        dftApiPrefix: apiPrefix
      });
      logFn({proxyTable});

      // Return the replacement function for create-react-app to use to generate the Webpack
      // Development Server config. "configFunction" is the function that would normally have
      // been used to generate the Webpack Development server config - you can use it to create
      // a starting configuration to then modify instead of having to create a config from scratch.
      return function (proxy, allowedHost) {
        // https://webpack.js.org/configuration/dev-server/#devserverproxy
        proxy = undefined;
        // webpack-dev-server proxy不支持正则表达式
        Object.keys(proxyTable).forEach(key => {
          proxy = proxy || {};
          proxy[key.replace(/^\^/, "")] = proxyTable[key];
        });
        // Create the default config by calling configFunction with the proxy/allowedHost parameters
        const config = configFunction(proxy, allowedHost);
        // react-scripts开发服务器默认强制serve在根地址`/`
        if (publicPath) {
          // webpack dev server publicPath必须为绝对路径
          // https://webpack.js.org/configuration/dev-server/#devserverpublicpath-
          config.publicPath = publicPath.replace(/^\.\/?/, "/");
        }
        logging.debug("webpack dev server config", config);

        // Return your customised Webpack Development Server config.
        return config;
      };
    }
  };
};