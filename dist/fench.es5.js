/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
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
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var AbortablePromise = /** @class */ (function () {
    function AbortablePromise(executor, aborter) {
        if (aborter === void 0) { aborter = null; }
        var _this = this;
        this.abortController = aborter || new AbortController();
        if (executor instanceof Promise) {
            this.promise = executor;
        }
        else {
            this.promise = new Promise(function (resolve, reject) {
                return executor(resolve, reject, _this.abortController.signal);
            });
        }
    }
    AbortablePromise.resolve = function (aborter, data) {
        if (aborter === void 0) { aborter = null; }
        return new AbortablePromise(Promise.resolve(data), aborter);
    };
    AbortablePromise.reject = function (aborter, err) {
        if (aborter === void 0) { aborter = null; }
        return new AbortablePromise(Promise.reject(err), aborter);
    };
    AbortablePromise.race = function (aborter, data) {
        if (aborter === void 0) { aborter = null; }
        return new AbortablePromise(Promise.race(data), aborter);
    };
    AbortablePromise.all = function (aborter, data) {
        if (aborter === void 0) { aborter = null; }
        return new AbortablePromise(Promise.all(data), aborter);
    };
    AbortablePromise.prototype.then = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        return new AbortablePromise((_a = this.promise).then.apply(_a, __spread(args)), this.abortController);
    };
    AbortablePromise.prototype.catch = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        return new AbortablePromise((_a = this.promise).catch.apply(_a, __spread(args)), this.abortController);
    };
    AbortablePromise.prototype.finally = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        return (_a = this.promise).finally.apply(_a, __spread(args));
    };
    AbortablePromise.prototype.abort = function () {
        return this.abortController.abort();
    };
    return AbortablePromise;
}());

var Interceptors = /** @class */ (function () {
    function Interceptors(API, interceptableMethods) {
        if (interceptableMethods === void 0) { interceptableMethods = []; }
        var _this = this;
        this.interceptors = [];
        if (!API) {
            throw new Error("API should be passed to the Interceptor");
        }
        this.API = API;
        if (interceptableMethods.length === 0) {
            throw new Error("no methods were added to interceptableMethods");
        }
        interceptableMethods.forEach(function (methodName) {
            var methodFn = API[methodName];
            API[methodName] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _this.interceptedMethod.apply(_this, __spread([methodFn], args));
            };
        });
    }
    Interceptors.prototype.register = function (interceptor) {
        var _this = this;
        this.interceptors.push(interceptor);
        return function () { return _this.unregister(interceptor); };
    };
    Interceptors.prototype.unregister = function (interceptor) {
        var index = this.interceptors.indexOf(interceptor);
        if (index >= 0) {
            this.interceptors.splice(index, 1);
        }
    };
    Interceptors.prototype.clear = function () {
        this.interceptors = [];
    };
    Interceptors.prototype.interceptedMethod = function (methodFn) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // const { interceptors, API } = this;
        var reversedInterceptors = this.interceptors.slice().reverse();
        var abortController = new AbortController();
        var promise = AbortablePromise.resolve(abortController, args);
        // Register request interceptors
        this.interceptors.forEach(function (_a) {
            var request = _a.request, requestError = _a.requestError;
            if (typeof request === "function") {
                promise = promise.then(function (args) {
                    return request.apply(void 0, __spread([promise.abortController.signal], [].concat(args)));
                });
            }
            if (typeof requestError === "function") {
                promise = promise.catch(requestError);
            }
        });
        // Register methodFn call
        if (typeof methodFn === "function") {
            promise = promise.then(function (args) {
                return methodFn.apply(void 0, __spread([promise.abortController.signal], [].concat(args)));
            });
        }
        // Register response interceptors
        reversedInterceptors.forEach(function (_a) {
            var response = _a.response, responseError = _a.responseError;
            if (typeof response === "function") {
                promise = promise.then(response);
            }
            if (typeof responseError === "function") {
                promise = promise.catch(responseError);
            }
        });
        if (this.API.timeout > 0) {
            var timer = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject(new Error("Timeout exceeded"));
                }, _this.API.timeout);
            });
            return AbortablePromise.race(abortController, [promise, timer]).then(function (value) {
                if (value && value.type === "timeout") {
                    promise.abort();
                }
                return value;
            }, function (err) { return Promise.reject(err); });
        }
        return promise;
    };
    return Interceptors;
}());

// import urlJoin from "url-join";
var urlJoin = require("url-join");
var qs = require("qs");
function createRequest(args) {
    var baseURI = args.baseURI, globalHeaders = args.globalHeaders, path = args.path, options = args.options, arrayFormat = args.arrayFormat, abortSignal = args.abortSignal;
    var opts = {};
    // Creating URI
    var endpoint = urlJoin(baseURI, path);
    var fullUri = urlJoin(endpoint, "" + (options.params ? "?" + qs.stringify(options.params, { arrayFormat: arrayFormat }) : ""));
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
    opts.method = options.method = "DELETE";
    // Creating body if nedeed
    if (options.method.toLowerCase() !== "get" &&
        options.method.toLowerCase() !== "head") {
        opts.body = options.body;
    }
    if (options.mode) {
        opts.mode = options.mode;
    }
    opts.signal = abortSignal;
    return __assign({}, opts, { endpoint: endpoint, params: options.params, raw: new Request(fullUri, opts), url: fullUri });
}

function parseResponse(res, contentType) {
    return __awaiter(this, void 0, void 0, function () {
        var body, err, err_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = null;
                    err = null;
                    if (!res.ok) return [3 /*break*/, 11];
                    if (!(contentType && contentType.includes("application/json"))) return [3 /*break*/, 8];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!(typeof res.json === "function")) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.json()];
                case 2:
                    body = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, res.text()];
                case 4:
                    body = _a.sent();
                    body = JSON.parse(body);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    return [2 /*return*/, err_1];
                case 7: return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, res.text()];
                case 9:
                    body = _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 18];
                case 11:
                    err = new Error(res.statusText);
                    if (!(contentType && contentType.includes("application/json"))) return [3 /*break*/, 18];
                    _a.label = 12;
                case 12:
                    _a.trys.push([12, 17, , 18]);
                    if (!(typeof res.json === "function")) return [3 /*break*/, 14];
                    return [4 /*yield*/, res.json()];
                case 13:
                    body = _a.sent();
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, res.text()];
                case 15:
                    body = _a.sent();
                    body = JSON.parse(body);
                    _a.label = 16;
                case 16:
                    // attempt to use better and human-friendly error messages
                    if (typeof body === "object" && typeof body.message === "string") {
                        err = new Error(body.message);
                    }
                    else if (!Array.isArray(body) &&
                        // attempt to utilize Stripe-inspired error messages
                        typeof body.error === "object") {
                        if (body.error.message) {
                            err = new Error(body.error.message);
                        }
                        if (body.error.stack) {
                            err.stack = body.error.stack;
                        }
                        if (body.error.code) {
                            err.code = body.error.code;
                        }
                        if (body.error.param) {
                            err.param = body.error.param;
                        }
                    }
                    return [3 /*break*/, 18];
                case 17:
                    e_1 = _a.sent();
                    err = e_1;
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/, { body: body, err: err }];
            }
        });
    });
}
function createResponse(rawResponse, fRequest) {
    return __awaiter(this, void 0, void 0, function () {
        var e_2, _a, fResponse, _b, _c, _d, key, value, _e, body, err;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    fResponse = {
                        body: null,
                        endpoint: fRequest.endpoint,
                        headers: {},
                        ok: rawResponse.ok,
                        raw: rawResponse,
                        request: fRequest,
                        status: rawResponse.status,
                        statusText: rawResponse.statusText,
                        type: rawResponse.type,
                        url: rawResponse.url
                    };
                    try {
                        for (_b = __values(rawResponse.headers), _c = _b.next(); !_c.done; _c = _b.next()) {
                            _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                            fResponse.headers[key] = value;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    return [4 /*yield*/, parseResponse(rawResponse, rawResponse.headers.get("Content-Type"))];
                case 1:
                    _e = _f.sent(), body = _e.body, err = _e.err;
                    if (err) {
                        fResponse.err = err;
                    }
                    fResponse.body = body;
                    return [2 /*return*/, fResponse];
            }
        });
    });
}

var methods = [
    "get",
    "head",
    "post",
    "put",
    "del",
    "delete",
    "options",
    "patch"
];
var Fench = /** @class */ (function () {
    function Fench(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        this.opts = opts;
        Object.defineProperty(this, "parseErr", {
            enumerable: false,
            value: opts.parseErr ||
                new Error("Invalid JSON received" + (opts.baseURI ? " from " + opts.baseURI : ""))
        });
        this.headers = __assign({}, opts.headers);
        this.opts.arrayFormat = opts.arrayFormat || "indices";
        // this.raw = opts.raw === true;
        // if (opts.auth) {
        //   this.auth(opts.auth);
        // }
        methods.forEach(function (method) {
            _this[method] = _this.setup(method);
        });
        // interceptor should be initialized after methods setup
        this.interceptor = new Interceptors(this, methods);
        this.timeout = opts.timeout || 0;
    }
    // public auth(creds) {
    //   if (typeof creds === "string") {
    //     const index = creds.indexOf(":");
    //     if (index !== -1)
    //       creds = [creds.substr(0, index), creds.substr(index + 1)];
    //   }
    //   if (!Array.isArray(creds)) {
    //     // eslint-disable-next-line prefer-rest-params
    //     creds = [].slice.call(arguments);
    //   }
    //   switch (creds.length) {
    //     case 0:
    //       creds = ["", ""];
    //       break;
    //     case 1:
    //       creds.push("");
    //       break;
    //     case 2:
    //       break;
    //     default:
    //       throw new Error("auth option can only have two keys `[user, pass]`");
    //   }
    //   if (typeof creds[0] !== "string") {
    //     throw new TypeError("auth option `user` must be a string");
    //   }
    //   if (typeof creds[1] !== "string") {
    //     throw new TypeError("auth option `pass` must be a string");
    //   }
    //   if (!creds[0] && !creds[1]) {
    //     delete this.headers.Authorization;
    //   } else {
    //     this.headers.Authorization = `Basic ${Buffer.from(
    //       creds.join(":")
    //     ).toString("base64")}`;
    //   }
    //   return this;
    // }
    // public jwt(token) {
    //   if (token === null) {
    //     delete this.headers.Authorization;
    //   } else if (typeof token === "string") {
    //     this.headers.Authorization = `Bearer ${token}`;
    //   } else {
    //     throw new TypeError("jwt token must be a string");
    //   }
    //   return this;
    // }
    Fench.prototype.setup = function (method) {
        var _this = this;
        return function (abortSignal, path, options) {
            if (path === void 0) { path = "/"; }
            // path must be string
            if (typeof path !== "string") {
                throw new TypeError("`path` must be a string");
            }
            // otherwise check if its an object
            if (typeof options !== "object" || Array.isArray(options)) {
                throw new TypeError("`options` must be an object");
            }
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var fRequest, rawResponse, fResponse, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            fRequest = createRequest({
                                baseURI: this.opts.baseURI,
                                globalHeaders: this.opts.headers,
                                path: path,
                                options: options,
                                arrayFormat: this.opts.arrayFormat,
                                abortSignal: abortSignal
                            });
                            return [4 /*yield*/, fetch(fRequest.raw)];
                        case 1:
                            rawResponse = _a.sent();
                            return [4 /*yield*/, createResponse(rawResponse, fRequest)];
                        case 2:
                            fResponse = _a.sent();
                            resolve(fResponse);
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            reject(err_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
    };
    return Fench;
}());

export default Fench;
//# sourceMappingURL=fench.es5.js.map
