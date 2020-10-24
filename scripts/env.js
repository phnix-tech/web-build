// https://webpack.js.org/configuration/mode/
module.exports = {
  isDev () {
    return process.env.NODE_ENV === "development";
  },

  isProd () {
    return process.env.NODE_ENV === "production";
  }
};