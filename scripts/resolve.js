const path = require("path");

// git子模块引用：假设当前路径为`src/common/build`
// npm包引用：假设当前位置
// `node_modules/@web-io/build/scripts`或`node_modules/@web-io/common/build`
let projectRoot = path.join(__dirname, "../../..");
// npm包引用
if (path.basename(projectRoot) === "node_modules") {
  projectRoot = path.join(projectRoot, "..");
}

/**
 * 基于项目根路径解析相对路径
 *
 * @param {string[]} dirPath - 项目根下面的子目录路径
 * @returns {string} 返回基于项目根路径的绝对路径
 */
function resolve (...dirPath) {
  const basePath = resolve.projectRoot || projectRoot;
  return path.resolve(basePath, ...dirPath);
}

/**
 * 基于项目根node_modules解析模块路径
 *
 * @param modulePath - module path
 * @returns {string} 返回绝对路径
 */
resolve.module = function (...modulePath) {
  return resolve("node_modules", ...modulePath);
};

// 外部可以主动设置项目根路径，可以用于npm link本地开发
resolve.projectRoot = undefined;

module.exports = resolve;