// import urlJoin from "url-join";
// import qs from "qs";

const urlJoin = require("url-join");
const qs = require("qs");

export interface IFenchRequest {
  body?: object;
  endpoint: string;
  headers: object;
  method?: string;
  mode: string;
  raw?: Request;
  params?: object;
  signal: AbortSignal;
  url: string;
}

interface IOptions {
  params?: object;
  body?: object;
  headers?: object;
  method?: string;
  mode?: string;
}

export default function createRequest(args: {
  baseURI: string;
  globalHeaders: object;
  path: string;
  options: IOptions;
  arrayFormat: string;
  abortSignal: AbortSignal;
}): IFenchRequest {
  const {
    baseURI,
    globalHeaders,
    path,
    options,
    arrayFormat,
    abortSignal
  } = args;

  const opts: any = {};
  // Creating URI
  const endpoint = urlJoin(baseURI, path);
  const fullUri = urlJoin(
    endpoint,
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
    options.method = "GET";
  }

  // Creating body if nedeed
  if (
    options.method.toLowerCase() !== "get" &&
    options.method.toLowerCase() !== "head"
  ) {
    opts.body = options.body;
  }

  if (options.mode) {
    opts.mode = options.mode;
  }

  opts.signal = abortSignal;

  return {
    ...opts,
    endpoint,
    params: options.params,
    raw: new Request(fullUri, opts),
    url: fullUri
  };
}
