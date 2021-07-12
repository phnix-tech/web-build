import type LintConfig from "../types/LintConfig";

/**
 * eslint默认规则重写，或者添加自定义规则
 *
 * @param cfg - eslint configuration object
 * @returns object
 */
export = function<T extends LintConfig = LintConfig> (cfg: T) {
  cfg.rules = Object.assign(cfg.rules || {}, {
    // 该规则不能正确解析export default from语法
    "object-curly-spacing": "off"
  });

  return cfg;
};