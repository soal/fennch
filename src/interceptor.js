import AbortablePromise from "./abortablePromise";

/**
 * { function_description }
 *
 * @class      Interceptor (name)
 * @return     {<type>}  { description_of_the_return_value }
 */
export default function Interceptor() {
  const interceptor = {
    register(interceptor) {
      this.interceptors.push(interceptor);
      return () => this.unregister(interceptor);
    },

    unregister(interceptor) {
      const index = this.interceptors.indexOf(interceptor);
      if (index >= 0) {
        this.interceptors.splice(index, 1);
      }
    },

    clear() {
      this.interceptors = [];
    },

    interceptRequest(fRequest) {
      let promise = AbortablePromise.resolve(fRequest.abortController, fRequest);
      this.interceptors.forEach(({ request, requestError } = {}) => {
        if (typeof request === "function") {
          promise = promise.then(req => request(req));
        }
        if (typeof requestError === "function") {
          promise = promise.catch(requestError);
        }
      });

      return promise;
    },

    async interceptResponseError(abortController, response) {
      let promise = AbortablePromise.reject(abortController, response);
      const reversedInterceptors = this.interceptors.slice().reverse();

      for (let { responseError } of reversedInterceptors) {
        if (typeof responseError === "function") {
          promise = promise.catch(responseError);
        }
      }
      return promise
    },

    interceptResponse(abortController, response) {
      let promise = AbortablePromise.resolve(abortController, response);
      const reversedInterceptors = this.interceptors.slice().reverse();

      reversedInterceptors.forEach(({ response, responseError }) => {
        if (typeof response === "function") {
          promise = promise.then(response);
        }
      });
      return promise;
    }
  };

  interceptor.interceptors = [];

  return interceptor;
}
