import path from "path";
import fs from "fs";
import assert from "assert";
import {describe, it} from "mocha";
import logging from "../fe/Logging";
import fn from "../functions";
import feFn from "../fe/Functions";

describe("be/functions", function () {
    describe("#createMeta", function () {
        const
            metaFile = path.join(__dirname, "./meta.json"),
            metaFile1 = path.join(__dirname, "./meta1.json"),
            metaFile2 = path.join(__dirname, "./meta2.json");

        it(`${metaFile} will be created`, function () {
            fn.createMeta(metaFile);
            assert.strictEqual(fs.statSync(metaFile).isFile(), true);
        });

        const keys = ["time", "hash", "timestamp", "version"];
        it(`meta file content should contain json keys: ${keys.join(", ")}`, function () {
            const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
            keys.forEach(key => {
                assert.strictEqual(metaData.hasOwnProperty(key), true);
            });
        });

        const
            customizedData = {
                foo: true,
                haha: "test",
                boo: 123
            };

        it(`${metaFile1}, ${metaFile2} will be created`, function () {
            fn.createMeta({
                path: [metaFile1, metaFile2],
                meta: function () {
                    logging.info("haha log test info");
                    logging.debug("haha log test debug");
                    logging.warn("haha log test warn");
                    logging.log("haha log test log");
                    // logging.error("haha log test error");
                    return customizedData;
                }
            });
            assert.strictEqual(fs.statSync(metaFile1).isFile(), true);
            assert.strictEqual(fs.statSync(metaFile2).isFile(), true);
        });

        it(`customized meta data should be ${JSON.stringify(customizedData)}`, function () {
            assert.strictEqual(fs.readFileSync(metaFile1, "utf-8"), JSON.stringify(customizedData));
            assert.strictEqual(fs.readFileSync(metaFile2, "utf-8"), JSON.stringify(customizedData));

            [metaFile, metaFile1, metaFile2].forEach(f => {
                fs.unlinkSync(f);
            });
        });
    });
});

describe("fe/Functions", function () {
    describe("#isValidEmail", function () {
        const email = "jefy.lee@garmin.com";
        it(`${email} is true`, function () {
            assert.strictEqual(feFn.isValidEmail(email), true);
        });

        const email1 = "jefy.lee@126";
        it(`${email1} is false`, function () {
            assert.strictEqual(feFn.isValidEmail(email1), false);
        });

        const email2 = "jefy.lee@126.co";
        it(`${email2} is true`, function () {
            assert.strictEqual(feFn.isValidEmail(email2), true);
        });
    });

    describe("#isUrlFormat", function () {
        const url = "https://localhost:8081";
        it(`${url} is true`, function () {
            assert.strictEqual(feFn.isUrlFormat(url), true);
        });

        const url1 = "htt://sports.garmin.cn:8081";
        it(`${url1} is false`, function () {
            assert.strictEqual(feFn.isUrlFormat(url1), false);
        });
    });

    describe("#isDomainFormat", function () {
        const domain = "localhost.com";
        it(`${domain} is true`, function () {
            assert.strictEqual(feFn.isDomainFormat(domain), true);
        });

        const domain1 = "//localhost:8081";
        it(`${domain1} is false`, function () {
            assert.strictEqual(feFn.isDomainFormat(domain1), false);
        });
    });

    describe("#uuid", function () {
        const
            pattern = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}/,
            uuid = feFn.uuid();
        it(`${uuid} should match pattern ${pattern.source}`, function () {
            assert.strictEqual(pattern.test(uuid), true);
        });
    });

    describe("#encodeStr", function () {
        const
            code = 123,
            str = "YIR-afbgch";
        it(`${code} encodeStr should be ${str}`, function () {
            assert.strictEqual(feFn.encodeStr(code), str);
        });
    });

    describe("#decodeStr", function () {
        const
            code = 123,
            str = "YIR-afbgch";
        it(`${str} decodeStr should be ${code}`, function () {
            assert.strictEqual(feFn.decodeStr(str), code.toString());
        });
    });
});