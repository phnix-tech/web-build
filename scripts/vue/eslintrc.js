/**
 * eslint默认规则重写，或者添加自定义规则
 * @param {*} cfg - eslint configuration object
 * @returns {*} object
 */
module.exports = function (cfg) {
  cfg.rules = Object.assign(cfg.rules || {}, {
    // 该规则不能正确解析export default from语法
    "object-curly-spacing": "off"
  });

  return cfg;
};
