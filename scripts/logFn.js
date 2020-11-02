const {logging} = require("./web-build");
const env = require("./env");

module.exports = function ({
  proxyTable,
  aliasPath,
  outputDir,
  publicPath
}) {
  if (proxyTable && env.isDev()) {
    logging.info("proxy config");
    logging.info(proxyTable);
  }

  if (aliasPath) {
    logging.info(`@/- alias path ${aliasPath}`);
  }

  if (publicPath) {
    logging.info(`publicPath: ${publicPath}`);
  }

  if (outputDir && env.isProd()) {
    logging.info("outputDir", outputDir);
  }
};