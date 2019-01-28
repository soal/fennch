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
exports.default = AbortablePromise;
//# sourceMappingURL=abortablePromise.js.map