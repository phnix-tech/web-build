/* eslint-env node */
/* eslint no-console:off */
const
  chalk = require("chalk"),
  semver = require("semver"),
  shell = require("shelljs");

function exec (cmd) {
  return require("child_process").execSync(cmd).toString().trim();
}

/**
 * check node/npm version requirement
 * borrowed fom vue cli
 * @param pkgCfg {object} package.json object
 */
module.exports = function (pkgCfg) {
  const warnings = [],
    versionRequirements = [{
      name: "node",
      currentVersion: semver.clean(process.version),
      versionRequirement: pkgCfg.engines.node
    }];

  if (shell.which("npm")) {
    versionRequirements.push({
      name: "npm",
      currentVersion: exec("npm --version"),
      versionRequirement: pkgCfg.engines.npm
    });
  }

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i];
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ": " +
        chalk.red(mod.currentVersion) + " should be " +
        chalk.green(mod.versionRequirement)
      );
    }
  }

  if (warnings.length) {
    console.log("");
    console.log(chalk.yellow("To use this template, you must update following to modules:"));
    console.log();
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i];
      console.log("  " + warning);
    }
    console.log();
    process.exit(1);
  }
};
