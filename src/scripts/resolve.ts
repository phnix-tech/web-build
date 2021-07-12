import path from "path";
import type {Any} from "../types";

interface Resolve {
  (...dirPath: string[]): string;
  module: (...modulePath: string[]) => string;
  require: <T = Any>(modulePath: string) => T;
  projectRoot?: string;
}

/**
 * git子模块引用：假设当前路径为`src/common/build`
 * npm包引用：假设当前位置
 * `node_modules/@web-io/build/lib/scripts`或
 * `node_modules/@web-io/common/lib/build`
 */
let projectRoot = path.join(__dirname, "../../..");
// npm包引用
if (projectRoot.includes(`${path.sep}node_modules${path.sep}`)) {
  projectRoot = path.join(projectRoot, "../..");
}

/**
 * 基于项目根路径解析相对路径
 *
 * @param dirPath - 项目根下面的子目录路径
 * @returns 返回基于项目根路径的绝对路径
 */
const resolve: Resolve = function (...dirPath: string[]) {
  const basePath = resolve.projectRoot || projectRoot;
  return path.resolve(basePath, ...dirPath);
};

/**
 * 基于项目根node_modules解析模块路径
 *
 * @param modulePath - module path
 * @returns 返回绝对路径
 */
resolve.module = function (...modulePath: string[]) {
  return resolve("node_modules", ...modulePath);
};

/**
 * `require` alias function
 * 注意：传递绝对路径模块路径，相对路径会相对于`resolve`文件所在路径，可能跟预期不一样
 * 可以使用`require.resolve`解析相对路径为绝对路径
 *
 * @param modulePath
 * @returns
 */
resolve.require = function <T = Any>(modulePath: string) {
  // error  Require statement not part of import statement  @typescript-eslint/no-var-requires
  // error  A `require()` style import is forbidden         @typescript-eslint/no-require-imports
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  return require(modulePath) as T;
};

/**
 * 外部可以主动设置项目根路径，可以用于npm link本地开发
 */
resolve.projectRoot = undefined;

export = resolve;