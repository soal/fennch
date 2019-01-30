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

  const fetch = fetchImpl || global.fetch

  Object.defineProperty(fennch, "parseErr", {
    enumerable: false,
    value:
      opts.parseErr ||
      new Error(
        `Invalid JSON received${opts.baseURI ? ` from ${opts.baseURI}` : ""}`
      )
  });

  // fennch.opts.arrayFormat = opts.arrayFormat;
  // fennch.timeout = opts.timeout || 0;

  const prepareRequest = (abortSignal, pathOrRequest = "/", options = {}) => {
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
        abortSignal
      });
    }

    return fRequest;
  };

  const setup = method => {
    return (abortSignal, pathOrRequest = "/", options = {}) => {
      const request = prepareRequest(abortSignal, pathOrRequest, {
        ...options,
        method
      });
      return makeRequest(abortSignal, request);
    };
  };

  const makeRequest = (abortSignal, fRequest) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rawResponse = await fetch(fRequest.raw);
        const fResponse = await createResponse(rawResponse, fRequest);

        resolve(fResponse);
      } catch (err) {
        const fResponse = await createResponse(err, fRequest);
        reject(fResponse);
      }
    });
  };

  fennch.req = (abortSignal, request) => {
    return makeRequest(abortSignal, request);
  };

  methods.forEach(method => {
    fennch[method] = setup(method);
  });

  // interceptor should be initialized after methods setup
  fennch.interceptor = new Interceptor(fennch, [...methods, "req"]);

  return fennch;
}
