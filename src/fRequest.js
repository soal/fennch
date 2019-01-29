// import urlJoin from "url-join";
// import qs from "qs";

const urlJoin = require("url-join");
const qs = require("qs");

export default function createRequest({
  baseURI,
  globalHeaders,
  path,
  options,
  arrayFormat.
  abortSignal
} = {}) {
  const opts = {};
  // Creating URI
  const fullUri = urlJoin(
    baseURI,
    path,
    `${
      options.params ? "?" + qs.stringify(options.params, { arrayFormat }) : ""
    }`
  );

  // Creating headers
  // remove any null or blank headers
  // (e.g. to automatically set Content-Type with `FormData` boundary)
  // const headers = new Headers();
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
    opts.body = options.body;
  }

  if (options.mode) {
    opts.mode = options.mode;
  }

  opts.signal = abortSignal;

  return {
    headers: opts.headers,
    method: opts.method,
    mode: opts.mode,
    path,
    params: options.params,
    raw: new Request(fullUri, opts),
    signal: opts.signal,
    url: fullUri
  };
}
