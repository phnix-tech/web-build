const
  path = require("path"),
  projectRoot = path.join(__dirname, "../../..");

/**
 * 基于项目根路径解析相对路径，假设默认当前文件位于`/src/common/build`第三级目录
 * @returns {string}
 */
function resolve () {
  const basePath = resolve.projectRoot || projectRoot;
  return path.resolve.apply(path, [basePath, ...arguments]);
}

resolve.projectRoot = projectRoot;

module.exports = resolve;
