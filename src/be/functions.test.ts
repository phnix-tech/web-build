import path from "path";
import fs from "fs";
import assert from "assert";
import logging from "../../fe/Logging";
import fn from "../../be/functions";

describe("be/functions", () => {
  describe("#createMeta", () => {
    const metaFile = path.join(__dirname, "./meta.json");
    const metaFile1 = path.join(__dirname, "./meta1.json");
    const metaFile2 = path.join(__dirname, "./meta2.json");

    it(`${metaFile} will be created`, () => {
      fn.createMeta(metaFile);
      assert.strictEqual(fs.statSync(metaFile).isFile(), true);
    });

    const keys = ["time", "hash", "timestamp", "version"];
    it(`meta file content should contain json keys: ${keys.join(", ")}`, () => {
      const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
      keys.forEach(key => {
        assert.strictEqual(metaData.hasOwnProperty(key), true);
      });
    });

    const customizedData = {
      foo: true,
      haha: "test",
      boo: 123
    };

    it(`${metaFile1}, ${metaFile2} will be created`, () => {
      fn.createMeta({
        path: [metaFile1, metaFile2],
        meta () {
          logging.info("haha log test info");
          logging.debug("haha log test debug");
          // warn message will be print stack trace
          // logging.warn("haha log test warn");
          logging.log("haha log test log");
          // logging.error("haha log test error");
          return customizedData;
        }
      });
      assert.strictEqual(fs.statSync(metaFile1).isFile(), true);
      assert.strictEqual(fs.statSync(metaFile2).isFile(), true);
    });

    it(`customized meta data should be ${JSON.stringify(customizedData)}`, () => {
      assert.strictEqual(fs.readFileSync(metaFile1, "utf-8"), JSON.stringify(customizedData));
      assert.strictEqual(fs.readFileSync(metaFile2, "utf-8"), JSON.stringify(customizedData));

      [metaFile, metaFile1, metaFile2].forEach(f => {
        fs.unlinkSync(f);
      });
    });
  });
});