const path = require("path");
// 当前位置`./node_modules/@web-io/build/scripts`
const projectRoot = path.join(__dirname, "../../../..");

/**
 * 基于项目根路径解析相对路径
 * @returns {string}
 */
function resolve () {
  const basePath = resolve.projectRoot || projectRoot;
  return path.resolve.apply(path, [basePath, ...arguments]);
}

resolve.projectRoot = projectRoot;

module.exports = resolve;
