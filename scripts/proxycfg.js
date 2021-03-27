const {logging} = require("./web-build");

// API代理主机
const proxyHost = process.env.PROXY_HOST;
// API URL重写
const proxyRewriteFrom = process.env.PROXY_REWRITE_FROM;
const proxyRewriteTo = process.env.PROXY_REWRITE_TO;

/**
 * customized proxy path, mainly for locale dev use
 *
 * @type {string} regexp path string, e.g. ^/mobile/blog/article/
 */
const proxyPathCustomize = process.env.PROXY_PATH_CUSTOMIZE;
/**
 * customized proxy host, e.g. http://192.168.0.111
 *
 * @type {string}
 */
const proxyHostCustomize = process.env.PROXY_HOST_CUSTOMIZE;

/**
 * rewrite path
 * pathRewrite: {'^/old/api' : '/new/api'}
 *
 * remove path
 * pathRewrite: {'^/remove/api' : ''}
 *
 * add base path
 * pathRewrite: {'^/' : '/basepath/'}
 *
 * @type {string} RegExp to match paths
 * @see https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options
 */
const proxyRewriteFromCustomize = process.env.PROXY_REWRITE_FROM_CUSTOMIZE;
// @type {string}
const proxyRewriteToCustomize = process.env.PROXY_REWRITE_TO_CUSTOMIZE;

const DFT_PROXY_OPT = {
  secure: false,
  changeOrigin: true
};
/**
 * path proxy table
 *
 * @see https://github.com/chimurai/http-proxy-middleware
 */
const dftProxyTable = {};

const DFT_API_PREFIX = "^/api/";
if (proxyHost) {
  Object.assign(dftProxyTable, {
    // default endpoint path prefix
    [DFT_API_PREFIX]: proxyHost
  });
}

// 单条自定义代理处理
cfgCustomizedProxy(
  proxyPathCustomize,
  proxyHostCustomize,
  proxyRewriteFromCustomize,
  proxyRewriteToCustomize
);

// 多条自定义代理处理
// PROXY_PATH_CUSTOMIZE_N
// PROXY_HOST_CUSTOMIZE_N
// PROXY_REWRITE_FROM_CUSTOMIZE_N
// PROXY_REWRITE_TO_CUSTOMIZE_N
Object.keys(process.env)
  .filter(env => env && env.startsWith("PROXY_PATH_CUSTOMIZE_"))
  .forEach(proxyPathKey => {
    const customizedProxyPath = process.env[proxyPathKey];
    const customizedProxyHost = process.env[proxyPathKey.replace("_PATH_", "_HOST_")];
    const customizedRewriteFrom = process.env[proxyPathKey.replace("_PATH_", "_REWRITE_FROM_")];
    const customizedRewriteTo = process.env[proxyPathKey.replace("_PATH_", "_REWRITE_TO_")];

    cfgCustomizedProxy(
      customizedProxyPath,
      customizedProxyHost,
      customizedRewriteFrom,
      customizedRewriteTo
    );
  });

convert(dftProxyTable);

/**
 * @see https://gitee.com/phoenix-tech/web-build/wikis/Proxy%20Config
 * @type {{proxyTable(*=): *, proxyHost: *}}
 */
module.exports = {
  proxyTable (proxyTable, {
    withDftProxyTable = true,
    dftApiPrefix = DFT_API_PREFIX
  } = {}) {
    logging.debug(`PROXY_HOST: ${proxyHost || "None"}`);
    logging.debug(`default api prefix: ${dftApiPrefix}`);

    const table = {};
    if (withDftProxyTable) {
      const dftProxyOpt = dftProxyTable[DFT_API_PREFIX];
      if (dftProxyOpt && dftApiPrefix !== DFT_API_PREFIX) {
        dftProxyTable[dftApiPrefix] = dftProxyOpt;
        delete dftProxyTable[DFT_API_PREFIX];
      }
      Object.assign(table, dftProxyTable);
    } else {
      logging.debug(`withDftProxyTable: ${withDftProxyTable}, so no api will proxy by default`);
    }

    return {
      ...table,
      ...convert(proxyTable)
    };
  },
  proxyHost
};

/**
 * customize proxy has high priority
 * 由于环境变量不能设置`undefined`, `null`，所以使用空字串来忽略先前的配置
 *
 * @param customizedProxyPath
 * @param customizedProxyHost
 * @param customizedRewriteFrom
 * @param customizedRewriteTo
 */
function cfgCustomizedProxy (
  customizedProxyPath,
  customizedProxyHost,
  customizedRewriteFrom,
  customizedRewriteTo
) {
  // 去除前后空格
  if (customizedProxyPath) {
    customizedProxyPath = customizedProxyPath.trim();
  }
  if (customizedProxyHost) {
    customizedProxyHost = customizedProxyHost.trim();
  }
  if (customizedRewriteFrom) {
    customizedRewriteFrom = customizedRewriteFrom.trim();
  }
  if (customizedRewriteTo) {
    customizedRewriteTo = customizedRewriteTo.trim();
  }

  if (!customizedProxyPath || !customizedProxyHost) {
    return;
  }

  // comma separated proxy path & host
  const pathCustomize = customizedProxyPath.split(/[,]/);
  const hostCustomize = customizedProxyHost.split(/[,]/);
  const rewriteFromCustomize = customizedRewriteFrom && customizedRewriteFrom.split(/[,]/);
  const rewriteToCustomize = customizedRewriteTo && customizedRewriteTo.split(/[,]/);

  pathCustomize.forEach((regexpPath, index) => {
    // path/host 一一映射，如果proxy host没有一一设置则使用第一个host
    let host = hostCustomize[index] || hostCustomize[0];

    // 去除前后空格
    regexpPath = regexpPath.trim();
    if (host) {
      host = host.trim();
    }

    if (!regexpPath || !host) {
      return;
    }

    logging.info(regexpPath, "===>", host);

    const cfg = {
      target: host,
      ...DFT_PROXY_OPT
    };

    const rewriteFrom = rewriteFromCustomize && (rewriteFromCustomize[index] || rewriteFromCustomize[0]);
    const rewriteTo = rewriteToCustomize && (rewriteToCustomize[index] || rewriteToCustomize[0]);
    if (rewriteFrom && rewriteTo) {
      logging.info("path rewrite");
      logging.info(rewriteFrom, "===>", rewriteTo);
      cfg.pathRewrite = {
        [rewriteFrom]: rewriteTo
      };
    }

    dftProxyTable[regexpPath] = cfg;
  });
}

/**
 * convert proxy option to http-proxy-middleware option
 *
 * @see https://github.com/chimurai/http-proxy-middleware
 * @param proxyTable {object|*}
 * @returns {*|{}}
 */
function convert (proxyTable) {
  proxyTable = proxyTable || {};

  Object.keys(proxyTable).forEach(context => {
    let options = proxyTable[context];
    if (typeof options === "string") {
      options = {
        target: options,
        ...DFT_PROXY_OPT
      };

      if (
        proxyRewriteFrom &&
        proxyRewriteTo
      ) {
        options.pathRewrite = {
          [proxyRewriteFrom]: proxyRewriteTo
        };
      }
    }

    proxyTable[context] = options;
  });

  return proxyTable;
}