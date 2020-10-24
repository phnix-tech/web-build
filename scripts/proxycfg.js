const
  {logging} = require("./web-build"),
  // api代理主机
  proxyHost = process.env.PROXY_HOST,
  proxyRewriteFrom = process.env.PROXY_REWRITE_FROM,
  proxyRewriteTo = process.env.PROXY_REWRITE_TO,

  // customized proxy path/host, mainly for locale dev use
  // @type {string} regexp path string, e.g. ^/mobile/blog/article/
  proxyPathCustomize = process.env.PROXY_PATH_CUSTOMIZE,
  // @type {string} proxy host, e.g. http://192.168.0.111
  proxyHostCustomize = process.env.PROXY_HOST_CUSTOMIZE,
  // @type {string}, RegExp to match paths
  // https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options
  /**
   *
   // rewrite path
   pathRewrite: {'^/old/api' : '/new/api'}

   // remove path
   pathRewrite: {'^/remove/api' : ''}

   // add base path
   pathRewrite: {'^/' : '/basepath/'}
   * @type {string}
   */
  proxyRewriteFromCustomize = process.env.PROXY_REWRITE_FROM_CUSTOMIZE,
  // @type {string}
  proxyRewriteToCustomize = process.env.PROXY_REWRITE_TO_CUSTOMIZE,

  // path proxy table
  // https://github.com/chimurai/http-proxy-middleware
  dftProxyTable = {};

/**
 * customize proxy has high priority
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
  if (!customizedProxyPath || !customizedProxyHost) {
    return;
  }

  logging.info(customizedProxyPath, "===>", customizedProxyHost);
  // comma separated proxy path & proxy host
  const
    pathCustomize = customizedProxyPath.split(/[,]/),
    hostCustomize = customizedProxyHost.split(/[,]/);

  pathCustomize.forEach((regexpPath, index) => {
    // path/host 一一映射
    let host = hostCustomize[index];

    // 去除前后空格
    regexpPath = regexpPath.trim();
    if (host) {
      host = host.trim();
    }

    if (!regexpPath || !host) {
      return;
    }

    const cfg = {
      filter (pathname) {
        return new RegExp(regexpPath).test(pathname);
      },
      target: host,
      secure: false,
      changeOrigin: true
    };

    if (
      customizedRewriteFrom !== undefined &&
      customizedRewriteTo !== undefined
    ) {
      // 去除前后空格
      customizedRewriteFrom = customizedRewriteFrom.trim();
      customizedRewriteTo = customizedRewriteTo.trim();

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
