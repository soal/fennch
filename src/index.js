import Interceptor from "./interceptor.js";
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

export default function Fench(
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
  const fench = {
    opts,
    fetch: fetchImpl || fetch.bind(global)
  };

  Object.defineProperty(fench, "parseErr", {
    enumerable: false,
    value:
      opts.parseErr ||
      new Error(
        `Invalid JSON received${opts.baseURI ? ` from ${opts.baseURI}` : ""}`
      )
  });

  fench.opts.arrayFormat = opts.arrayFormat;
  fench.timeout = opts.timeout || 0;

  const prepareRequest = (abortSignal, pathOrRequest = "/", options = {}) => {
    if (options && (typeof options !== "object" || Array.isArray(options))) {
      throw new TypeError("`options` must be an object");
    }

    options = {
      ...fench.opts,
      ...options
    };

    let fRequest = null;

    if (pathOrRequest.headers) {
      fRequest = pathOrRequest;
    } else {
      if (typeof pathOrRequest !== "string") {
        throw new TypeError("`path` must be a string");
      }

      fRequest = createRequest({
        baseURI: fench.opts.baseURI,
        globalHeaders: fench.opts.headers,
        path: pathOrRequest,
        options,
        arrayFormat: fench.opts.arrayFormat,
        abortSignal
      });
    }

    return fRequest;
  };

  const setup = method => {
    return (abortSignal, pathOrRequest = "/", options = {}) => {
      const request = prepareRequest(abortSignal, pathOrRequest, options);
      return makeRequest(abortSignal, request);
    };
  };

  const makeRequest = (abortSignal, fRequest) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rawResponse = await fench.fetch(fRequest.raw);
        const fResponse = await createResponse(rawResponse, fRequest);

        resolve(fResponse);
      } catch (err) {
        const fResponse = await createResponse(err, fRequest);
        reject(fResponse);
      }
    });
  };

  fench.req = (abortSignal, request) => {
    return makeRequest(abortSignal, request);
  };

  methods.forEach(method => {
    fench[method] = setup(method);
  });

  // interceptor should be initialized after methods setup
  fench.interceptor = new Interceptor(fench, [...methods, "req"]);

  return fench;
}

