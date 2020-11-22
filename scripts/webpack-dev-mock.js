const logging = require("../fe/Logging");

module.exports = function (devServer) {
  // 开启mock中间件
  // https://gitee.com/phoenix-tech/web-project-template/issues/I25HHW
  if (/^(1|true)$/.test(process.env.MOCK)) {
    logging.info("开启mock中间件");
    const webpackDevMock = require("webpack-dev-mock");
    const originalDevServeBefore = devServer.before;
    devServer.before = function (app, server) {
      // dev mock
      webpackDevMock(app);

      if (typeof originalDevServeBefore === "function") {
        originalDevServeBefore(app, server);
      }
    };
  }
};