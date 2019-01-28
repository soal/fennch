interface IAbortablePromise {
  abortController: AbortController;
  promise: Promise<any>;
}

type PromiseExecutor = (
  resolve?: (value?: any) => void,
  reject?: (value?: any) => void,
  abortSignal?: AbortSignal
) => any;

class AbortablePromise implements AbortController {
  public static resolve(aborter = null, data) {
    return new AbortablePromise(Promise.resolve(data), aborter);
  }

  public static reject(aborter = null, err) {
    return new AbortablePromise(Promise.reject(err), aborter);
  }

  public static race(aborter = null, data) {
    return new AbortablePromise(Promise.race(data), aborter);
  }

  public static all(aborter = null, data) {
    return new AbortablePromise(Promise.all(data), aborter);
  }

  public signal: AbortSignal;
  public abortController: AbortController;

  private promise: Promise<any>;

  constructor(
    executor: Promise<any> | PromiseExecutor,
    aborter: AbortController | null = null
  ) {
    this.abortController = aborter || new AbortController();
    if (executor instanceof Promise) {
      this.promise = executor;
    } else {
      this.promise = new Promise((resolve, reject) =>
        executor(resolve, reject, this.abortController.signal)
      );
    }
  }

  public then(...args) {
    return new AbortablePromise(
      this.promise.then(...args),
      this.abortController
    );
  }

  public catch(...args) {
    return new AbortablePromise(
      this.promise.catch(...args),
      this.abortController
    );
  }

  public finally(...args) {
    return this.promise.finally(...args);
  }

  public abort() {
    return this.abortController.abort();
  }
}

export default AbortablePromise;
