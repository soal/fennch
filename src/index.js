import Interceptor from "./interceptor.js";
import AbortablePromise from "./abortablePromise";
import createResponse from "./fResponse.js";
import createRequest from "./fRequest.js";

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
    baseUri: "",
    mode: "cors",
    arrayFormat: "indices",
    auth: {},
    timeout: 0
  },
  fetchImpl = null
) {
  const fennch = {
    opts
  };

  const fetch = fetchImpl || global.fetch;

  fennch.interceptor = Interceptor();

  // TODO: Remove?
  Object.defineProperty(fennch, "parseErr", {
    enumerable: false,
    value:
      opts.parseErr ||
      new Error(
        `Invalid JSON received${opts.baseURI ? ` from ${opts.baseURI}` : ""}`
      )
  });

  const prepareRequest = (path = "/", options = {}) => {
    if (options && (typeof options !== "object" || Array.isArray(options))) {
      throw new TypeError("`options` must be an object");
    }

    options = {
      ...fennch.opts,
      ...options
    };
    if (typeof path !== "string") {
      throw new TypeError("`path` must be a string");
    }

    const abortController = new AbortController();

    const fRequest = createRequest({
      baseUri: fennch.opts.baseUri,
      path,
      mode: options.mode,
      method: options.method,
      globalHeaders: fennch.opts.headers,
      headers: options.headers,
      params: options.params,
      body: options.body,
      arrayFormat: fennch.opts.arrayFormat,
      abortController
    });

    return fRequest;
  };

  const makeRequest = fRequest => {
    const promise = new AbortablePromise(async (resolve, reject) => {
      try {
        fRequest = await fennch.interceptor.interceptRequest(fRequest);
        const rawResponse = await fetch(fRequest.raw);
        let fResponse = await createResponse(rawResponse, fRequest);
        fResponse = await fennch.interceptor.interceptResponse(
          fRequest.abortController,
          fResponse
        );

        resolve(fResponse);
      } catch (err) {
        const fResponse = await createResponse(err, fRequest);
        reject(fResponse);
      }
    }, fRequest.abortController);

    const timeout = fRequest.timeout || fennch.opts.timeout;

    if (timeout > 0) {
      let timerId = null;
      const timer = new Promise((resolve, reject) => {
        timerId = setTimeout(() => {
          clearTimeout(timerId);
          reject(new Error("Timeout exceeded"));
        }, timeout);
      });

      return AbortablePromise.race(fRequest.abortController, [
        promise,
        timer
      ]).then(
        value => {
          return value;
        },
        err => {
          if (err && err.message === "Timeout exceeded") {
            promise.abort();
          }
          return Promise.reject(err);
        }
      );
    }
    return promise;
  };

  const setup = method => {
    return (path = "/", options = {}) => {
      const request = prepareRequest(path, {
        ...options,
        method
      });
      return fennch.req(request);
    };
  };

  fennch.req = request => makeRequest(createRequest(request));

  methods.forEach(method => {
    fennch[method] = setup(method);
  });

  return fennch;
}

export const APromise = AbortablePromise;
export const createFResponse = createResponse;
export const createFRequect = createRequest;
