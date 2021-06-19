import fs from "fs";
import webBuild from "./web-build";
import env from "./env";
import resolve from "./resolve";

const {logging} = webBuild;

/**
 * 移除自动生成的`debug.local.[tj]s`中的自导入`import "./debug.local";`
 * 不过实际中也没有报自导入死循环!？
 */
function removeDebugLocalImport (localDebugFile: string) {
  const importStatement = "import \"./debug.local\";";
  const content = fs.readFileSync(localDebugFile, "utf-8");
  if (content.indexOf(importStatement) !== -1) {
    fs.writeFileSync(
      localDebugFile,
      content
        // 删除两行只留一个空行
        .replace("\r\n\r\n" + importStatement, "")
        .replace("\n\n" + importStatement, "")
        .replace("\r\n" + importStatement, "")
        .replace("\n" + importStatement, "")
    );
  }
}

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

  if (fs.existsSync(debugJsPath) && !fs.existsSync(localDebugJsPath)) {
    logging.info("createLocalDebugJs");
    logging.debug("copy", debugJsPath, "to", localDebugJsPath);
    fs.copyFileSync(debugJsPath, localDebugJsPath);
    removeDebugLocalImport(localDebugJsPath);
  }
  if (fs.existsSync(debugTsPath) && !fs.existsSync(localDebugTsPath)) {
    logging.info("createLocalDebugTs");
    logging.debug("copy", debugTsPath, "to", localDebugTsPath);
    fs.copyFileSync(debugTsPath, localDebugTsPath);
    removeDebugLocalImport(localDebugTsPath);
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
      const importStatement = "import \"./debug.local\";";
      const content = fs.readFileSync(debugFile, "utf-8");
      if (content.indexOf("// " + importStatement) === -1) {
        logging.info("disable debug import in production build");
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
      const importStatement = "import \"./debug.local\";";
      const content = fs.readFileSync(debugFile, "utf-8");
      if (content.indexOf("// " + importStatement) !== -1) {
        logging.info("restore debug import after production build");
        fs.writeFileSync(
          debugFile,
          content.replace("// " + importStatement, importStatement)
        );
      }
      break;
    }
  }
}

export = {
  createLocalDebugJs,
  disableDebug,
  restoreDebug
};