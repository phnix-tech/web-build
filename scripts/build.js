const fs = require("fs");
const path = require("path");
const
  // 相对路径都以项目根路径为基准
  // build output dir
  origResPath = "./dist",
  // common module source path
  commonSrcPath = "../common/src",
  // common module output dir
  commonDestPath = "./src/common";

let
  _fse,
  _logging,
  _functions,
  // project root path
  _dirname;

/**
 * clean up build output files
 * 默认删除`./dist`目录
 * @param {string|Array<string>} paths
 * 额外删除的目录路径，路径为相对路径，相对于项目根路径
 */
function clean (paths = []) {
  _logging.log("==============clean up build output files==============");

  [
    origResPath,
    ...((Array.isArray(paths) ? paths : [paths]).filter(item => item))
  ].forEach(dir => {
    dir = path.join(_dirname, dir);
    if (fs.existsSync(dir)) {
      _logging.info("remove directory", dir);
      _functions.rmdir(dir);
    }
  });

  _logging.log("==============clean up build output files DONE==============");
}

/**
 * cause of babel plugin dependence issue
 * we copy common modules to project src directory
 */
function copyCommonModules () {
  const
    src = path.join(_dirname, commonSrcPath),
    dest = path.join(_dirname, commonDestPath);

  _logging.info("copy", src, "===>", dest);
  _fse.copySync(src, dest);
}

function copyResources () {
  _logging.info("==============copy resource files==============");
  copyCommonModules();
  _logging.info("==============copy resource files DONE==============");
}

/**
 * 创建本地调试js/ts文件，本地调试文件会被版本管理系统排除
 * 可用于修改前端环境变量比如切换api服务器实时调试而不用重启服务器等
 */
function createLocalDebugJs () {
  const debugJsPath = path.join(_dirname, "./src/debug.js");
  const localDebugJsPath = path.join(_dirname, "./src/debug.local.js");
  const debugTsPath = path.join(_dirname, "./src/debug.ts");
  const localDebugTsPath = path.join(_dirname, "./src/debug.local.ts");

  _logging.info("createLocalDebugJs");
  if (fs.existsSync(debugJsPath) && !fs.existsSync(localDebugJsPath)) {
    _logging.debug("copy", debugJsPath, "to", localDebugJsPath);
    fs.copyFileSync(debugJsPath, localDebugJsPath);
  }
  if (fs.existsSync(debugTsPath) && !fs.existsSync(localDebugTsPath)) {
    _logging.debug("copy", debugTsPath, "to", localDebugTsPath);
    fs.copyFileSync(debugTsPath, localDebugTsPath);
  }
}

function setup ({
  // optional
  fse,
  // required
  logging,
  // required
  functions,
  // required
  dirname
}) {
  _fse = fse;
  _logging = logging;
  _functions = functions;
  _dirname = dirname;
  _logging.log(`Current working dir: ${process.cwd()}`);
}

module.exports = {
  setup,
  clean,
  copyCommonModules,
  copyResources,
  createLocalDebugJs
};
