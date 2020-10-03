/* eslint-env node */
const
    fs = require("fs"),
    path = require("path"),
    // https://www.npmjs.com/package/mkdirp
    mkdirp = require("mkdirp"),
    // https://www.npmjs.com/package/tar
    tar = require("tar"),
    // https://www.npmjs.com/package/portfinder
    portfinder = require("portfinder");

function rmdir (dir) {
    if (!fs.existsSync(dir) ||
        !fs.statSync(dir).isDirectory()) {
        return;
    }
    const list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
        const
            filename = path.join(dir, list[i]),
            stat = fs.statSync(filename);

        if (filename === "." || filename === "..") {
            // pass these files
        } else if (stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm filename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
}

function createMetaObj () {
    const
        crypto = require("crypto"),
        md5 = crypto.createHash("md5"),
        now = new Date(),
        time = [now.getFullYear(), now.getMonth() + 1, now.getDate(),
            now.getHours(), now.getMinutes(), now.getSeconds()]
            .map(item => item.toString().padStart(2, "0")),
        timestamp = now.getTime(),
        hash = md5.update(timestamp.toString()).digest("hex");

    return {
        time: time.join(""),
        hash: hash,
        timestamp: timestamp,
        version: time.concat(hash).join("-")
    };
}

module.exports = {
    rmdir: rmdir,
    mkdirp: function (dir) {
        if (!fs.existsSync(dir) || fs.statSync(dir).isFile()) {
            mkdirp.sync(dir);
        }
    },
    // node-tar wrapper object
    tar: tar,
    /**
     * create front-end build meta json object
     * @param {string|array<string>|object} path - meta file path(s)
     * or option object, path: {string|array<string>}, meta: {object|function}
     * @returns {object} meta object
     */
    createMeta: function (path) {
        const
            opts = path,
            isObj = obj => { return Object.prototype.toString.call(obj) === "[object Object]"; },
            isAry = obj => { return Object.prototype.toString.call(obj) === "[object Array]"; };

        let meta = null,
            metaStr;

        if (arguments.length === 1 && isObj(opts)) {
            path = opts.path;
            let metaObj = opts.meta;
            // you can provide customized meta factory function to
            // generate your own meta data object
            if (typeof metaObj === "function") {
                metaObj = metaObj();
            }
            if (isObj(metaObj)) {
                meta = metaObj;
            }
        }

        // default meta data
        if (!meta) {
            meta = createMetaObj();
        }

        metaStr = JSON.stringify(meta);
        path = !isAry(path) ? [path] : path;
        path.forEach(p => { fs.writeFileSync(p, metaStr); });

        return meta;
    },
    /**
     * resolve garmin hostname if found otherwise localhost
     * @returns {string}
     */
    hostname: function () {
        let hostname;
        if (process.platform.toLowerCase() === "win32") {
            // https://nodejs.org/api/os.html#os_os_hostname
            hostname = require("os").hostname();
            // garmin hostname format c3-gis-jefy, t1-gis-zusan
            if (/^(c3|t1)-/i.test(hostname) &&
                !/ad\.garmin\.com$/i.test(hostname)) {
                hostname = hostname.toLowerCase() + ".ad.garmin.com";
            }
        }
        hostname = hostname || "localhost";
        return hostname;
    },
    /**
     * @see https://www.npmjs.com/package/portfinder
     * @returns {{PortfinderCallback: PortfinderCallback; PortFinderOptions: PortFinderOptions; basePort: number; getPort; getPorts; getPortPromise}}
     */
    portfinder: function () {
        return portfinder;
    }
};