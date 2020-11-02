const fs = require("fs");
const path = require("path");
const logging = require("../fe/Logging");
const functions = require("../functions");

// 相对路径都以项目根路径为基准
// build output dir
const origResPath = "./dist";
// common module source path
const commonSrcPath = "../common/src";
// common module output dir
const commonDestPath = "./src/common";

let
  _fse,
  // project root path
  _dirname;

/**
 * clean up build output files
 * 默认删除`./dist`目录
 * @param {string|Array<string>} paths
 * 额外删除的目录路径，路径为相对路径，相对于项目根路径
 */
function clean (paths = []) {
  logging.log("==============clean up build output files==============");

  [
    origResPath,
    ...((Array.isArray(paths) ? paths : [paths]).filter(item => item))
  ].forEach(dir => {
    dir = path.join(_dirname, dir);
    if (fs.existsSync(dir)) {
      logging.info("remove directory", dir);
      functions.rmdir(dir);
    }
  });

  logging.log("==============clean up build output files DONE==============");
}

/**
 * cause of babel plugin dependence issue
 * we copy common modules to project src directory
 */
function copyCommonModules () {
  const
    src = path.join(_dirname, commonSrcPath),
    dest = path.join(_dirname, commonDestPath);

  logging.info("copy", src, "===>", dest);
  _fse.copySync(src, dest);
}

function copyResources () {
  logging.info("==============copy resource files==============");
  copyCommonModules();
  logging.info("==============copy resource files DONE==============");
}

function setup ({
  // optional
  fse,
  // required
  dirname
}) {
  _fse = fse;
  _dirname = dirname;
  logging.log(`Current working dir: ${process.cwd()}`);
}

module.exports = {
  setup,
  clean,
  copyCommonModules,
  copyResources
};
