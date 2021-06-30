import debugUtils from "./debug-utils";
import webBuild from "./web-build";
import resolve from "./resolve";

import type Config from "./types/Config";

const {logging, functions: fn} = webBuild;
// 项目构建配置
const config: Config = resolve.require(resolve("./build/config"));
const file = resolve(`./dist/${config.outputName}.tgz`);

fn.createMeta(`./dist/${config.outputName}/meta.json`);

fn.tar.create({
  file,
  gzip: true,
  sync: true,
  cwd: resolve("./dist")
}, [config.outputName]);

logging.info(file);

// 打包完成，恢复debug导入
debugUtils.restoreDebug();