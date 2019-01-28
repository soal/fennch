"use strict";
// import urlJoin from "url-join";
// import qs from "qs";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var urlJoin = require("url-join");
var qs = require("qs");
function createRequest(args) {
    var baseURI = args.baseURI, globalHeaders = args.globalHeaders, path = args.path, options = args.options, arrayFormat = args.arrayFormat, abortSignal = args.abortSignal;
    var opts = {};
    // Creating URI
    var fullUri = urlJoin(baseURI, path, "" + (options.params ? "?" + qs.stringify(options.params, { arrayFormat: arrayFormat }) : ""));
    // Creating headers
    // remove any null or blank headers
    // (e.g. to automatically set Content-Type with `FormData` boundary)
    // const headers = new Headers();
    var headersObj = {};
    Object.entries(options.headers).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if ((typeof value !== "undefined" && value !== null) || value !== "") {
            headersObj[key] = value;
        }
    });
    opts.headers = new Headers(headersObj);
    if (options.method) {
        opts.method =
            options.method === "del" ? "DELETE" : options.method.toUpperCase();
    }
    else {
        options.method = "GET";
    }
    // Creating body if nedeed
    if (options.method.toLowerCase() !== "get" &&
        options.method.toLowerCase() !== "head") {
        opts.body = options.body;
    }
    if (options.mode) {
        opts.mode = options.mode;
    }
    opts.signal = abortSignal;
    return __assign({}, opts, { path: path, params: options.params, raw: new Request(fullUri, opts), url: fullUri });
}
exports.default = createRequest;
//# sourceMappingURL=fRequest.js.map