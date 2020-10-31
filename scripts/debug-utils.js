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

/**
 * 生产环境注释debug导入
 */
function disableDebug () {
  if (!env.isProd()) {
    return;
  }
  const debugs = ["debug.js", "debug.ts"];
  for (const debug of debugs) {
    const debugFile = resolve("src", debug);
    if (fs.existsSync(debugFile)) {
      // eslint-disable-next-line quotes
      const importStatement = `import "./debug.local";`;
      const content = fs.readFileSync(debugFile, "utf-8");
      if (content.indexOf("// " + importStatement) === -1) {
        fs.writeFileSync(
          debugFile,
          content.replace(importStatement, "// " + importStatement)
        );
      }
      break;
    }
  }
}

/**
 * 构建完成恢复debug导入
 */
function restoreDebug () {
  const debugs = ["debug.js", "debug.ts"];
  for (const debug of debugs) {
    const debugFile = resolve("src", debug);
    if (fs.existsSync(debugFile)) {
      // eslint-disable-next-line quotes
      const importStatement = `import "./debug.local";`;
      const content = fs.readFileSync(debugFile, "utf-8");
      if (content.indexOf("// " + importStatement) !== -1) {
        fs.writeFileSync(
          debugFile,
          content.replace("// " + importStatement, importStatement)
        );
      }
      break;
    }
  }
}

module.exports = {
  createLocalDebugJs,
  disableDebug,
  restoreDebug
};