const {logging} = require("./web-build");
// api代理主机
const proxyHost = process.env.PROXY_HOST;
const proxyRewriteFrom = process.env.PROXY_REWRITE_FROM;
const proxyRewriteTo = process.env.PROXY_REWRITE_TO;

// customized proxy path/host, mainly for locale dev use
// @type {string} regexp path string, e.g. ^/mobile/blog/article/
const proxyPathCustomize = process.env.PROXY_PATH_CUSTOMIZE;
// @type {string} proxy host, e.g. http://192.168.0.111
const proxyHostCustomize = process.env.PROXY_HOST_CUSTOMIZE;
// @type {string}, RegExp to match paths
// https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options
/**
 // rewrite path
 pathRewrite: {'^/old/api' : '/new/api'}

 // remove path
 pathRewrite: {'^/remove/api' : ''}

 // add base path
 pathRewrite: {'^/' : '/basepath/'}

 * @type {string}
 */
const proxyRewriteFromCustomize = process.env.PROXY_REWRITE_FROM_CUSTOMIZE;
// @type {string}
const proxyRewriteToCustomize = process.env.PROXY_REWRITE_TO_CUSTOMIZE;

// path proxy table
// https://github.com/chimurai/http-proxy-middleware
const dftProxyTable = {};

/**
 * customize proxy has high priority
 * 由于环境变量不能设置undefined, null，所以使用空字串来忽略先前的配置
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

  // comma separated proxy path & proxy host
  // 可以一一映射path和host，如果proxy host没有一一设置则使用第一个host
  const pathCustomize = customizedProxyPath.split(/[,]/);
  const hostCustomize = customizedProxyHost.split(/[,]/);

  pathCustomize.forEach((regexpPath, index) => {
    // path/host 一一映射
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
      filter (pathname) {
        return new RegExp(regexpPath).test(pathname);
      },
      target: host,
      secure: false,
      changeOrigin: true
    };

    if (
      customizedRewriteFrom &&
      customizedRewriteTo
    ) {

      logging.info("path rewrite");
      logging.info(customizedRewriteFrom, "===>", customizedRewriteTo);
      cfg.pathRewrite = {
        [customizedRewriteFrom]: customizedRewriteTo
      };
    }

    dftProxyTable[regexpPath] = cfg;
  });
}

cfgCustomizedProxy(
  proxyPathCustomize,
  proxyHostCustomize,
  proxyRewriteFromCustomize,
  proxyRewriteToCustomize
);

// PROXY_PATH_CUSTOMIZE_N
// PROXY_HOST_CUSTOMIZE_N
// PROXY_REWRITE_FROM_CUSTOMIZE_N
// PROXY_REWRITE_TO_CUSTOMIZE_N
Object.keys(process.env)
  .filter(env => env && env.startsWith("PROXY_PATH_CUSTOMIZE_"))
  .forEach(proxyPathKey => {
    const
      customizedProxyPath = process.env[proxyPathKey],
      customizedProxyHost = process.env[proxyPathKey.replace("_PATH_", "_HOST_")],
      customizedRewriteFrom = process.env[proxyPathKey.replace("_PATH_", "_REWRITE_FROM_")],
      customizedRewriteTo = process.env[proxyPathKey.replace("_PATH_", "_REWRITE_TO_")];

    cfgCustomizedProxy(
      customizedProxyPath,
      customizedProxyHost,
      customizedRewriteFrom,
      customizedRewriteTo
    );
  });

const DFT_API_PREFIX = "^/api/";
if (proxyHost) {
  Object.assign(dftProxyTable, {
    // default endpoint path prefix
    [DFT_API_PREFIX]: proxyHost
  });
}

/**
 * convert proxy option to http-proxy-middleware option
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
        secure: false,
        changeOrigin: true
      };

      if (
        proxyRewriteFrom !== undefined &&
        proxyRewriteTo !== undefined
      ) {
        options[proxyRewriteFrom.trim()] = proxyRewriteTo.trim();
      }
    }

    proxyTable[context] = options;
  });

  return proxyTable;
}

convert(dftProxyTable);

/**
 * 通过环境变量指定api路径代理
 * PROXY_HOST
 * PROXY_REWRITE_FROM
 * PROXY_REWRITE_TO
 * PROXY_PATH_CUSTOMIZE
 * PROXY_HOST_CUSTOMIZE
 * PROXY_REWRITE_FROM_CUSTOMIZE
 * PROXY_REWRITE_TO_CUSTOMIZE
 * PROXY_PATH_CUSTOMIZE_N
 * PROXY_HOST_CUSTOMIZE_N
 * PROXY_REWRITE_FROM_CUSTOMIZE_N
 * PROXY_REWRITE_TO_CUSTOMIZE_N
 * @example
 * PROXY_PATH_CUSTOMIZE=^/mobile/blog/article/
 * PROXY_HOST_CUSTOMIZE=http://192.168.0.203:8082
 * PROXY_REWRITE_FROM_CUSTOMIZE=^/api/mobile/blog/article/
 * PROXY_REWRITE_TO_CUSTOMIZE=/mobile/blog/article/
 * PROXY_PATH_CUSTOMIZE_1=^/books/
 * PROXY_HOST_CUSTOMIZE_1=http://192.168.0.203:8082
 * PROXY_REWRITE_FROM_CUSTOMIZE_1=^/api/books/
 * PROXY_REWRITE_TO_CUSTOMIZE_1=
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
      if (dftApiPrefix !== DFT_API_PREFIX) {
        dftProxyTable[dftApiPrefix] = dftProxyTable[DFT_API_PREFIX];
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
