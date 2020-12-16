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
      const url = publicPath;
      // 支持浏览器打开publicPath url
      urls.lanUrlForTerminal = urls.lanUrlForTerminal.replace(/\/$/, "") + url;
      urls.localUrlForTerminal = urls.localUrlForTerminal.replace(/\/$/, "") + url;
      urls.localUrlForBrowser = urls.localUrlForBrowser.replace(/\/$/, "") + url;
    }

    if (
      urls.lanUrlForConfig &&
      urls.lanUrlForConfig.indexOf(":") !== -1
    ) {
      // https://webpack.js.org/configuration/dev-server/#devserverpublic
      // lanUrlForConfig为IP地址无端口，会传递给webpack-dev-server public选项
      urls.lanUrlForConfig = `${urls.lanUrlForConfig}:${port}`;
    }
    return urls;
  };
};