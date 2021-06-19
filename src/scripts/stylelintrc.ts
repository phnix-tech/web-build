/**
 * stylelint原生支持vue单文件style标签lint ！？
 * 连vue template中标签的inline style也可以检查 ！？
 *
 * @param cfg - stylelint configuration object
 * @returns configuration object
 * @see https://vue-loader.vuejs.org/zh/guide/linting.html#stylelint
 */
export = function<
  T extends Record<"rules", Record<string, unknown>> = Record<"rules", Record<string, unknown>>
> (cfg: T) {
  cfg.rules = Object.assign(cfg.rules || {}, {
    // add or override rules
  });

  return cfg;
};