const
  {
    logging,
    functions: fn
  } = require("./web-build"),
  resolve = require("./resolve"),
  config = require(resolve("./build/config")),
  file = resolve(`./dist/${config.outputName}.tgz`);

fn.createMeta(`./dist/${config.outputName}/meta.json`);

fn.tar.create({
  file,
  gzip: true,
  cwd: resolve("./dist")
}, [config.outputName]);

logging.info(file);
