import debugUtils from "./debug-utils";
import webBuild from "./web-build";
import resolve from "./resolve";

import type Config from "./types/Config";

const {logging, functions: fn} = webBuild;
// 项目构建配置
// error  Require statement not part of import statement  @typescript-eslint/no-var-requires
// error  A `require()` style import is forbidden         @typescript-eslint/no-require-imports
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const config: Config = require(resolve("./build/config"));
const file = resolve(`./dist/${config.outputName}.tgz`);

fn.createMeta(`./dist/${config.outputName}/meta.json`);

fn.tar.create({
  file,
  gzip: true,
  cwd: resolve("./dist")
}, [config.outputName]);

logging.info(file);

// 打包完成，恢复debug导入
debugUtils.restoreDebug();