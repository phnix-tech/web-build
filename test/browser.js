import assert from "assert";
import {describe, it} from "mocha";
import feFn from "../fe/Functions";

describe("browser detection", function () {
    const
        iosSafari = "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1",
        androidNexus = "Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",

        iosGSM = "com.garmin.gccm/2.5.0.3 (iOS 11.1.2; iPhone 7 Plus; 32BDF1DC-5010-4215-AB16-74D3E9F5F9E1) Alamofire/4.2",
        androidGSM = "Dalvik/2.1.0 (Linux; U; Android 7.0; MI 5s MIUI/V9.6.1.0.NAGCNFD);com.garmin.android.apps.gccm 2.6.1;device-id : 82216455-5cff-4a5a-a9a4-f9f171ea6cc6R ;User-id : 6023",

        chromeWindows = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",

        iosWechat = "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.3(0x17000321) NetType/WIFI Language/zh_CN",

        androidWechat = "Mozilla/5.0 (Linux; Android 7.0; FRD-AL00 Build/HUAWEIFRD-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044705 Mobile Safari/537.36 MMWEBID/1613 MicroMessenger/7.0.4.1420(0x2700043C) Process/tools NetType/WIFI Language/zh_CN",

        firefoxWindows = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0";

    describe("#isMobile", function () {
        it(`ios safari ua: "${iosSafari}" true`, function () {
            assert.strictEqual(feFn.browser.isMobile(iosSafari), true);
        });

        it(`ios GSM ua: "${iosGSM}" true`, function () {
            assert.strictEqual(feFn.browser.isMobile(iosGSM), true);
        });

        it(`android GSM ua: "${androidGSM}" true`, function () {
            assert.strictEqual(feFn.browser.isMobile(androidGSM), true);
        });

        it(`ios wechat ua: "${iosWechat}" true`, function () {
            assert.strictEqual(feFn.browser.isMobile(iosWechat), true);
        });

        it(`android wechat ua: "${androidWechat}" true`, function () {
            assert.strictEqual(feFn.browser.isMobile(androidWechat), true);
        });

        it(`chrome windows ua: "${chromeWindows}" false`, function () {
            assert.strictEqual(feFn.browser.isMobile(chromeWindows), false);
        });

        it(`firefox windows ua: "${firefoxWindows}" false`, function () {
            assert.strictEqual(feFn.browser.isMobile(firefoxWindows), false);
        });
    });

    describe("#isiOS", function () {
        it(`ios safari ua: "${iosSafari}" true`, function () {
            assert.strictEqual(feFn.browser.isiOS(iosSafari), true);
        });

        it(`ios GSM ua: "${iosGSM}" true`, function () {
            assert.strictEqual(feFn.browser.isiOS(iosGSM), true);
        });

        it(`android nexus ua: "${androidNexus}" false`, function () {
            assert.strictEqual(feFn.browser.isiOS(androidNexus), false);
        });

        it(`android GSM ua: "${androidGSM}" false`, function () {
            assert.strictEqual(feFn.browser.isiOS(androidGSM), false);
        });
    });

    describe("#isAndroid", function () {
        it(`ios safari ua: "${iosSafari}" false`, function () {
            assert.strictEqual(feFn.browser.isAndroid(iosSafari), false);
        });

        it(`ios GSM ua: "${iosGSM}" false`, function () {
            assert.strictEqual(feFn.browser.isAndroid(iosGSM), false);
        });

        it(`android nexus ua: "${androidNexus}" true`, function () {
            assert.strictEqual(feFn.browser.isAndroid(androidNexus), true);
        });

        it(`android GSM ua: "${androidGSM}" true`, function () {
            assert.strictEqual(feFn.browser.isAndroid(androidGSM), true);
        });
    });

    describe("#isGsmIos", function () {
        it(`ios safari ua: "${iosSafari}" false`, function () {
            assert.strictEqual(feFn.browser.isGsmIos(iosSafari), false);
        });

        it(`ios GSM ua: "${iosGSM}" true`, function () {
            assert.strictEqual(feFn.browser.isGsmIos(iosGSM), true);
        });

        it(`android nexus ua: "${androidNexus}" false`, function () {
            assert.strictEqual(feFn.browser.isGsmIos(androidNexus), false);
        });

        it(`android GSM ua: "${androidGSM}" false`, function () {
            assert.strictEqual(feFn.browser.isGsmIos(androidGSM), false);
        });
    });

    describe("#isGsmAndroid", function () {
        it(`ios safari ua: "${iosSafari}" false`, function () {
            assert.strictEqual(feFn.browser.isGsmAndroid(iosSafari), false);
        });

        it(`ios GSM ua: "${iosGSM}" false`, function () {
            assert.strictEqual(feFn.browser.isGsmAndroid(iosGSM), false);
        });

        it(`android nexus ua: "${androidNexus}" false`, function () {
            assert.strictEqual(feFn.browser.isGsmAndroid(androidNexus), false);
        });

        it(`android GSM ua: "${androidGSM}" true`, function () {
            assert.strictEqual(feFn.browser.isGsmAndroid(androidGSM), true);
        });
    });

    describe("#isGSM", function () {
        it(`ios safari ua: "${iosSafari}" false`, function () {
            assert.strictEqual(feFn.browser.isGSM(iosSafari), false);
        });

        it(`ios GSM ua: "${iosGSM}" true`, function () {
            assert.strictEqual(feFn.browser.isGSM(iosGSM), true);
        });

        it(`android nexus ua: "${androidNexus}" false`, function () {
            assert.strictEqual(feFn.browser.isGSM(androidNexus), false);
        });

        it(`android GSM ua: "${androidGSM}" true`, function () {
            assert.strictEqual(feFn.browser.isGSM(androidGSM), true);
        });
    });

    describe("#isWechat", function () {
        it(`ios safari ua: "${iosSafari}" false`, function () {
            assert.strictEqual(feFn.browser.isWechat(iosSafari), false);
        });

        it(`ios GSM ua: "${iosGSM}" false`, function () {
            assert.strictEqual(feFn.browser.isWechat(iosGSM), false);
        });

        it(`android nexus ua: "${androidNexus}" false`, function () {
            assert.strictEqual(feFn.browser.isWechat(androidNexus), false);
        });

        it(`android GSM ua: "${androidGSM}" false`, function () {
            assert.strictEqual(feFn.browser.isWechat(androidGSM), false);
        });

        it(`ios wechat ua: "${iosWechat}" true`, function () {
            assert.strictEqual(feFn.browser.isWechat(iosWechat), true);
        });

        it(`android wechat ua: "${androidWechat}" true`, function () {
            assert.strictEqual(feFn.browser.isWechat(iosWechat), true);
        });
    });
});