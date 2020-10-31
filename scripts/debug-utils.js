const fs = require("fs");
const logging = require("../fe/Logging");
const env = require("./env");
const resolve = require("./resolve");

/**
 * 创建本地调试js/ts文件，本地调试文件会被版本管理系统排除
 * 可用于修改前端环境变量比如切换api服务器实时调试而不用重启服务器等
 */
function createLocalDebugJs () {
  // 只在开发模式创建调试文件
  if (!env.isDev()) {
    return;
  }

  const debugJsPath = resolve("./src/debug.js");
  const localDebugJsPath = resolve("./src/debug.local.js");
  const debugTsPath = resolve("./src/debug.ts");
  const localDebugTsPath = resolve("./src/debug.local.ts");

  logging.info("createLocalDebugJs");
  if (fs.existsSync(debugJsPath) && !fs.existsSync(localDebugJsPath)) {
    logging.debug("copy", debugJsPath, "to", localDebugJsPath);
    fs.copyFileSync(debugJsPath, localDebugJsPath);
  }
  if (fs.existsSync(debugTsPath) && !fs.existsSync(localDebugTsPath)) {
    logging.debug("copy", debugTsPath, "to", localDebugTsPath);
    fs.copyFileSync(debugTsPath, localDebugTsPath);
  }
}

module.exports = {
  createLocalDebugJs
};