const fs = require("fs");
const logging = require("../fe/Logging");
const resolve = require("./resolve");

function isVue () {
  return fs.existsSync(resolve("node_modules/@vue"));
}

function isReact () {
  return fs.existsSync(resolve("node_modules/react-scripts"));
}

// https://webpack.js.org/configuration/mode/
module.exports = {
  isDev () {
    return process.env.NODE_ENV === "development";
  },

  isProd () {
    return process.env.NODE_ENV === "production";
  },

  isVue,

  isReact,

  /**
   * 转换以`APP_`为前缀的环境变量到vue cli、create react app环境变量格式
   * 因为vue cli、create react app只会传递特定前缀的环境变量到客户端如`VUE_APP_XXX`或者`REACT_APP_XXX`
   * @see https://create-react-app.dev/docs/adding-custom-environment-variables
   * @see https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F
   */
  transformEnv () {
    Object.keys(process.env).forEach(env => {
      // 处理以`APP_`为前缀的环境变量
      if (!/^APP_/.test(env)) {
        return;
      }

      const val = process.env[env];
      let key = "";
      if (
        isReact() &&
        !process.env.hasOwnProperty(`REACT_${env}`)
      ) {
        key = `REACT_${env}`;
      } else if (
        isVue() &&
        !process.env.hasOwnProperty(`VUE_${env}`)
      ) {
        key = `VUE_${env}`;
      }

      if (key) {
        logging.debug(`transform environment variable ${env} to ${key}`);
        process.env[key] = val;
      }
    });
  }
};