require("abort-controller/polyfill");

/**
 * Class for abortable promise.
 *
 * @class      AbortablePromise (name)
 */
class AbortablePromise {
  constructor(executor, aborter) {
    this.abortController = aborter || new AbortController();
    if (executor instanceof Promise) {
      this.promise = executor;
    } else {
      this.promise = new Promise((resolve, reject) => executor(resolve, reject, this.abortController.signal));
    }
  }

  then(...args) {
    return new AbortablePromise(this.promise.then(...args), this.abortController);
  }

  catch(...args) {
    return new AbortablePromise(this.promise.catch(...args), this.abortController);
  }

  finally(...args) {
    return this.promise.finally(...args);
  }

  abort() {
    return this.abortController.abort();
  }
}

AbortablePromise.resolve = function(aborter = null, ...args) {
  return new AbortablePromise(Promise.resolve(...args), aborter);
};

AbortablePromise.reject = function(aborter = null, err) {
  return new AbortablePromise(Promise.reject(err), aborter);
};

AbortablePromise.race = function(aborter = null, ...args) {
  return new AbortablePromise(Promise.race(...args), aborter);
};

AbortablePromise.all = function(aborter = null, ...args) {
  return new AbortablePromise(Promise.all(...args), aborter);
};

export default AbortablePromise;
