/**
 * stylelint原生支持vue单文件style标签lint ！？
 * 连vue template中标签的inline style也可以检查 ！？
 * @see https://vue-loader.vuejs.org/zh/guide/linting.html#stylelint
 * @param {*} cfg - stylelint configuration object
 * @returns {*} configuration object
 */
module.exports = function (cfg) {
  Object.assign(cfg.rules, {
    // add extra rules
  });

  return cfg;
};
