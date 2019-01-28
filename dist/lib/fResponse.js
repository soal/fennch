"use strict";
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
exports.default = createResponse;
//# sourceMappingURL=fResponse.js.map