import webBuild from "./web-build";
import env from "./env";

const {logging} = webBuild;

export = function ({
  proxyTable,
  aliasPath,
  outputDir,
  publicPath
}: {
  proxyTable?: Record<string, unknown>;
  aliasPath?: string;
  outputDir?: string;
  publicPath?: string;
}) {
  if (proxyTable && env.isDev()) {
    logging.info("proxy config");
    logging.info(proxyTable);
  }

  if (aliasPath) {
    logging.info(`@ alias path ${aliasPath}`);
  }

  if (publicPath) {
    logging.info(`publicPath: ${publicPath}`);
  }

  if (outputDir && env.isProd()) {
    logging.info("outputDir", outputDir);
  }
};