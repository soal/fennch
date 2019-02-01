import qs from "qs";
// const qs = require("qs");

export default function createRequest({
  baseURI,
  globalHeaders,
  path,
  options,
  arrayFormat,
  abortSignal
} = {}) {
  const opts = {};

  opts.params = options.params;
  // Creating URI
  const fullUri = `${baseURI}${path}${
    opts.params ? "?" + qs.stringify(opts.params, { arrayFormat }) : ""
  }`;
  // Creating headers
  // remove any null or blank headers
  // (e.g. to automatically set Content-Type with `FormData` boundary)

  const headersObj = {};
  Object.entries(options.headers).forEach(([key, value]) => {
    if ((typeof value !== "undefined" && value !== null) || value !== "") {
      headersObj[key] = value;
    }
  });
  opts.headers = new Headers(headersObj);

  if (options.method) {
    opts.method =
      options.method === "del" ? "DELETE" : options.method.toUpperCase();
  } else {
    opts.method = "GET";
  }

  // Creating body if nedeed
  if (
    opts.method.toLowerCase() !== "get" &&
    opts.method.toLowerCase() !== "head"
  ) {
    const isBinary = [
      Blob,
      FormData
    ].reduce((acc, type) => options.body instanceof type)

    if (isBinary) {
      opts.body = options.body;
    } else {
      opts.body = JSON.stringify(options.body);
    }
  }

  if (options.mode) {
    opts.mode = options.mode;
  }
  opts.timeout = options.timeout;

  opts.signal = abortSignal;

  return {
    headers: opts.headers,
    method: opts.method,
    mode: opts.mode,
    timeout: opts.timeout,
    path,
    params: opts.params,
    raw: new Request(fullUri, opts),
    signal: opts.signal,
    url: fullUri
  };
}

