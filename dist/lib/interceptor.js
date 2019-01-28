"use strict";
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
var abortablePromise_1 = require("./abortablePromise");
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
        var promise = abortablePromise_1.default.resolve(abortController, args);
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
            return abortablePromise_1.default.race(abortController, [promise, timer]).then(function (value) {
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
exports.default = Interceptors;
//# sourceMappingURL=interceptor.js.map