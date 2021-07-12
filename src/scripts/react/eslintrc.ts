import type LintConfig from "../types/LintConfig";

/**
 * eslint默认规则重写，或者添加自定义规则
 *
 * @param cfg - eslint configuration object
 * @returns object
 */
export = function<T extends LintConfig = LintConfig> (cfg: T) {
  // react项目模板暂无规则重写
  return cfg;
};