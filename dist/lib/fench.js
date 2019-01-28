"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var interceptor_1 = require("./interceptor");
var fRequest_1 = require("./fRequest");
var fResponse_1 = require("./fResponse");
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
    function Fench(opts, fetchImpl) {
        if (opts === void 0) { opts = {}; }
        if (fetchImpl === void 0) { fetchImpl = null; }
        var _this = this;
        this.opts = opts;
        this.fetch = fetchImpl || fetch.bind(global);
        Object.defineProperty(this, "parseErr", {
            enumerable: false,
            value: opts.parseErr ||
                new Error("Invalid JSON received" + (opts.baseURI ? " from " + opts.baseURI : ""))
        });
        this.opts.arrayFormat = opts.arrayFormat || "indices";
        methods.forEach(function (method) {
            _this[method] = _this.setup(method);
        });
        this.req = function (abortSignal, request) {
            return _this.makeRequest(abortSignal, request);
        };
        // interceptor should be initialized after methods setup
        this.interceptor = new interceptor_1.default(this, __spread(methods, ["req"]));
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
    // public req(abortSignal: AbortSignal, request: IFenchRequest) {
    //   return this.makeRequest(abortSignal, request);
    // }
    Fench.prototype.jwt = function (token) {
        if (token === null) {
            delete this.opts.headers.Authorization;
        }
        else if (typeof token === "string") {
            this.opts.headers.Authorization = "Bearer " + token;
        }
        else {
            throw new TypeError("jwt token must be a string");
        }
        return this;
    };
    Fench.prototype.makeRequest = function (abortSignal, fRequest) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var rawResponse, fResponse, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.fetch(fRequest.raw)];
                    case 1:
                        rawResponse = _a.sent();
                        return [4 /*yield*/, fResponse_1.default(rawResponse, fRequest)];
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
    Fench.prototype.prepareRequest = function (abortSignal, pathOrRequest, options) {
        if (pathOrRequest === void 0) { pathOrRequest = "/"; }
        if (options && (typeof options !== "object" || Array.isArray(options))) {
            throw new TypeError("`options` must be an object");
        }
        options = __assign({}, this.opts, options);
        var fRequest = null;
        var req = pathOrRequest;
        if (req.headers) {
            fRequest = req;
        }
        else {
            if (typeof pathOrRequest !== "string") {
                throw new TypeError("`path` must be a string");
            }
            fRequest = fRequest_1.default({
                baseURI: this.opts.baseURI,
                globalHeaders: this.opts.headers,
                path: pathOrRequest,
                options: options,
                arrayFormat: this.opts.arrayFormat,
                abortSignal: abortSignal
            });
        }
        return fRequest;
    };
    Fench.prototype.setup = function (method) {
        var _this = this;
        return function (abortSignal, pathOrRequest, options) {
            if (pathOrRequest === void 0) { pathOrRequest = "/"; }
            var request = _this.prepareRequest(abortSignal, pathOrRequest, options);
            return _this.makeRequest(abortSignal, request);
        };
    };
    return Fench;
}());
exports.default = Fench;
//# sourceMappingURL=fench.js.map