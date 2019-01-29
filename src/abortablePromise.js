class AbortablePromise {
  constructor(executor, aborter = new AbortController()) {
    this.abortController = aborter;
    if (executor instanceof Promise) {
      this.promise = executor;
    } else {
      this.promise = new Promise((resolve, reject) =>
        executor(resolve, reject, this.abortController.signal)
      );
    }
  }

  then(...args) {
    return new AbortablePromise(
      this.promise.then(...args),
      this.abortController
    );
  }

  catch(...args) {
    return new AbortablePromise(
      this.promise.catch(...args),
      this.abortController
    );
  }

  finally(...args) {
    return this.promise.finally(...args);
  }

  abort() {
    return this.abortController.abort();
  }
}

AbortablePromise.resolve = function(aborter = null, data) {
  return new AbortablePromise(Promise.resolve(data), aborter);
};

AbortablePromise.reject = function(aborter = null, err) {
  return new AbortablePromise(Promise.reject(err), aborter);
};

AbortablePromise.race = function(aborter = null, data) {
  return new AbortablePromise(Promise.race(data), aborter);
};

AbortablePromise.all = function(aborter = null, data) {
  return new AbortablePromise(Promise.all(data), aborter);
};

export default AbortablePromise;
