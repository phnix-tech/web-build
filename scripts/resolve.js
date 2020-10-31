const path = require("path");
// 当前位置`./node_modules/@web-io/build/scripts`
const projectRoot = path.join(__dirname, "../../../..");

/**
 * 基于项目根路径解析相对路径
 * @returns {string} 返回绝对路径
 */
function resolve () {
  const basePath = resolve.projectRoot || projectRoot;
  return path.resolve.apply(path, [basePath, ...arguments]);
}

/**
 * 基于项目根node_modules解析模块路径
 * @param modulePath - module path
 * @returns {string} 返回绝对路径
 */
resolve.module = function (...modulePath) {
  return resolve("node_modules", ...modulePath);
};

// 外部可以主动设置项目根路径，可以用于npm link本地开发
resolve.projectRoot = projectRoot;

module.exports = resolve;