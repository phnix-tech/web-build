const resolve = require("../resolve");
// react-scripts默认打开根地址`/`
// react-scripts/scripts/start.js
const WebpackDevServerUtils = require(resolve.module("react-dev-utils/WebpackDevServerUtils"));
const {prepareUrls} = WebpackDevServerUtils;

module.exports = function (publicPath) {
  WebpackDevServerUtils.prepareUrls = function (protocol, host, port) {
    const urls = prepareUrls.apply(prepareUrls, arguments);

    if (
      publicPath &&
      publicPath !== "/" &&
      /^\//.test(publicPath)
    ) {
      // lan url被react scripts去除了尾部斜线/
      if (!urls.lanUrlForTerminal.endsWith("/")) {
        urls.lanUrlForTerminal += "/";
      }
      if (!urls.localUrlForTerminal.endsWith("/")) {
        urls.localUrlForTerminal += "/";
      }
      if (!urls.localUrlForBrowser.endsWith("/")) {
        urls.localUrlForBrowser += "/";
      }
    }

    if (
      urls.lanUrlForConfig &&
      urls.lanUrlForConfig.indexOf(":") === -1
    ) {
      // lanUrlForConfig为IP地址无端口，会传递给webpack-dev-server public选项
      // https://webpack.js.org/configuration/dev-server/#devserverpublic
      urls.lanUrlForConfig = `${urls.lanUrlForConfig}:${port}`;
    }

    return urls;
  };
};