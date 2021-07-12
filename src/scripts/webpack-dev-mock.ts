import resolve from "./resolve";
import webBuild from "./web-build";

const {logging} = webBuild;

interface DevServer {
  before: (app: unknown, server: unknown) => void;
}

export = function<T extends DevServer = DevServer> (devServer: T) {
  // 开启mock中间件
  // https://gitee.com/phoenix-tech/web-project-template/issues/I25HHW
  if (/^(1|true)$/.test(process.env.MOCK || "")) {
    logging.info("开启mock中间件");
    const webpackDevMock = resolve.require("webpack-dev-mock");
    const originalDevServeBefore = devServer.before;
    devServer.before = function (app: unknown, server: unknown) {
      // dev mock
      webpackDevMock(app);

      if (typeof originalDevServeBefore === "function") {
        originalDevServeBefore(app, server);
      }
    };
  }
};