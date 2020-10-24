const {logging, functions: fn} = require("./web-build");
const resolve = require("./resolve");
// 项目构建配置
const config = require(resolve("./build/config"));
const file = resolve(`./dist/${config.outputName}.tgz`);

fn.createMeta(`./dist/${config.outputName}/meta.json`);

fn.tar.create({
  file,
  gzip: true,
  cwd: resolve("./dist")
}, [config.outputName]);

logging.info(file);
