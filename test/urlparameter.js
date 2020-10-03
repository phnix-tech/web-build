import assert from "assert";
import {describe, it} from "mocha";
import feFn from "../fe/Functions";

describe("URLParameter", function () {
    const url = "/foo?t&t1=&t2&f=1&foo=&foo1";

    describe("#getURLParameter", function () {
        const
            fVal = "1",
            fooVal = "",
            foo1Val = "",
            foo2Val = null;

        it(`${url} search param f value should be ${fVal}`, function () {
            const f = feFn.getURLParameter("f", url);
            assert.strictEqual(f, fVal);
        });

        it(`${url} search param foo value should be "${fooVal}"`, function () {
            const foo = feFn.getURLParameter("foo", url);
            assert.strictEqual(foo, fooVal);
        });

        it(`${url} search param foo1 value should be "${foo1Val}"`, function () {
            const foo1 = feFn.getURLParameter("foo1", url);
            assert.strictEqual(foo1, foo1Val);
        });

        it(`${url} search param foo2 value should be ${foo2Val}`, function () {
            const foo1 = feFn.getURLParameter("foo2", url);
            assert.strictEqual(foo1, foo2Val);
        });
    });

    describe("#replaceURLParameter", function () {
        const
            url1 = feFn.replaceURLParameter("foo", "test", url),
            newurl1 = url.replace("foo=", "foo=test"),
            url2 = feFn.replaceURLParameter("foo2", "haha", url),
            newurl2 = url + "&foo2=haha";

        it(`${url} replace search param foo with test should be ${newurl1}`, function () {
            assert.strictEqual(url1, newurl1);
        });

        it(`${url} replace search param foo2 with haha should be ${newurl2}`, function () {
            assert.strictEqual(url2, newurl2);
        });

        const
            url3 = "/foo",
            url31 = feFn.replaceURLParameter("key", "plan", url3),
            newurl31 = url3 + "?key=plan";

        it(`${url3} replace search param key with plan should be ${newurl31}`, function () {
            assert.strictEqual(url31, newurl31);
        });
    });

    describe("#removeURLParameter", function () {
        const
            url1 = feFn.removeURLParameter("foo", url),
            newurl1 = url.replace("foo=&", ""),
            url2 = feFn.removeURLParameter("f", url),
            newurl2 = url.replace("f=1&", ""),
            url3 = feFn.removeURLParameter("foo1", url),
            newurl3 = url.replace("&foo1", "");

        it(`${url} remove search param foo should be ${newurl1}`, function () {
            assert.strictEqual(url1, newurl1);
        });

        it(`${url} remove search param f should be ${newurl2}`, function () {
            assert.strictEqual(url2, newurl2);
        });

        it(`${url} remove search param foo1 should be ${newurl3}`, function () {
            assert.strictEqual(url3, newurl3);
        });

        const
            url4 = "/foo?f=1",
            url41 = feFn.removeURLParameter("f", url4),
            newurl41 = url4.replace("?f=1", "");

        it(`${url4} remove search param f should be ${newurl41}`, function () {
            assert.strictEqual(url41, newurl41);
        });

        const
            url8 = "/foo?f=1&k=test",
            url81 = feFn.removeURLParameter("f", url8),
            newurl81 = url8.replace("f=1&", "");

        it(`${url8} remove search param f should be ${newurl81}`, function () {
            assert.strictEqual(url81, newurl81);
        });

        const
            url5 = feFn.removeURLParameter("t", url),
            newurl5 = url.replace("t&", ""),
            url6 = feFn.removeURLParameter("t1", url),
            newurl6 = url.replace("t1=&", ""),
            url7 = feFn.removeURLParameter("t2", url),
            newurl7 = url.replace("&t2&", "&");

        it(`${url} remove search param t should be ${newurl5}`, function () {
            assert.strictEqual(url5, newurl5);
        });
        it(`${url} remove search param t1 should be ${newurl6}`, function () {
            assert.strictEqual(url6, newurl6);
        });
        it(`${url} remove search param t2 should be ${newurl7}`, function () {
            assert.strictEqual(url7, newurl7);
        });

        it("/foo?onlyOneParam remove search param onlyOneParam should be /foo", function () {
            assert.strictEqual(feFn.removeURLParameter("onlyOneParam", "/foo?onlyOneParam"), "/foo");
        });
    });
});