import Interceptor from "./interceptor.js";
import AbortablePromise from "./abortablePromise";
import createRequest from "./fRequest.js";
import createResponse from "./fResponse.js";

const methods = [
  "get",
  "head",
  "post",
  "put",
  "del",
  "delete",
  "options",
  "patch"
];

export default function Fennch(
  opts = {
    parseErr: null,
    headers: {},
    baseURI: "",
    arrayFormat: "indices",
    auth: {},
    timeout: 0,
    body: {},
    signal: null
  },
  fetchImpl = null
) {
  const fennch = {
    opts
  };

  const fetch = fetchImpl || global.fetch;

  fennch.interceptor = Interceptor();

  Object.defineProperty(fennch, "parseErr", {
    enumerable: false,
    value:
      opts.parseErr ||
      new Error(
        `Invalid JSON received${opts.baseURI ? ` from ${opts.baseURI}` : ""}`
      )
  });

  const prepareRequest = (abortController, pathOrRequest = "/", options = {}) => {
    let fRequest = null;

    if (pathOrRequest.headers) {
      fRequest = pathOrRequest;
    } else {
      if (options && (typeof options !== "object" || Array.isArray(options))) {
        throw new TypeError("`options` must be an object");
      }

      options = {
        ...fennch.opts,
        ...options
      };
      if (typeof pathOrRequest !== "string") {
        throw new TypeError("`path` must be a string");
      }

      fRequest = createRequest({
        baseURI: fennch.opts.baseURI,
        globalHeaders: fennch.opts.headers,
        path: pathOrRequest,
        options,
        arrayFormat: fennch.opts.arrayFormat,
        abortController
      });
    }

    return fRequest;
  };

  const makeRequest = (abortController, fRequest) => {
    const promise = new AbortablePromise(async (resolve, reject) => {
      try {
        fRequest = await fennch.interceptor.interceptRequest(abortController, fRequest);
        const rawResponse = await fetch(fRequest.raw);
        let fResponse = await createResponse(rawResponse, fRequest);
        fResponse = await fennch.interceptor.interceptResponse(abortController, fResponse);

        resolve(fResponse);
      } catch (err) {
        const fResponse = await createResponse(err, fRequest);
        reject(fResponse);
      }
    }, abortController);

    const timeout = fRequest.timeout || fennch.opts.timeout;

    if (timeout > 0) {
      let timerId = null
      const timer = new Promise((resolve, reject) => {
        timerId = setTimeout(() => {
          clearTimeout(timerId)
          reject(new Error("Timeout exceeded"));
        }, timeout);
      });

      return AbortablePromise.race(abortController, [promise, timer])
        .then(
          value => {
            return value
          },
          err => {
            if (err && err.message === "Timeout exceeded") {
              promise.abort();
            }
            return Promise.reject(err);
          }
        )
    }
    return promise
  };

  const setup = method => {
    return (pathOrRequest = "/", options = {}) => {
      const abortController = new AbortController();
      const request = prepareRequest(abortController, pathOrRequest, {
        ...options,
        method
      });
      return makeRequest(abortController, request);
    };
  };

  fennch.req = request => {
    return makeRequest(request.abortController, request);
  };

  methods.forEach(method => {
    fennch[method] = setup(method);
  });

  return fennch;
}
