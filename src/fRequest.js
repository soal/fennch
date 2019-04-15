import qs from "qs";

/**
 * Makes a headers proxy.
 *
 * @param      {<type>}  requestHeaders  The request headers
 * @return     {Proxy}   { description_of_the_return_value }
 */
function makeHeadersProxy(requestHeaders) {
  const proxy = new Proxy(requestHeaders, {
    get(headers, key) {
      if (key === "raw") {
        if (typeof requestHeaders.raw === "function") {
          return requestHeaders.raw.bind(headers);
        }
        return requestHeaders;
      }

      if (key === Symbol.iterator) {
        return headers[Symbol.iterator].bind(headers);
      } else if (typeof headers[key] === "function") {
        return new Proxy(headers[key], {
          apply(method, thisArg, args) {
            return method.call(headers, ...args);
          }
        });
      } else if (headers.has(key)) {
        return headers.get(key);
      } else {
        return headers[key];
      }
    },

    set(headers, key, value) {
      // NOTE: this prevents to add several headers with same key
      if (headers.has(key)) {
        headers.set(key, value);
      } else {
        headers.append(key, value);
      }
      return true;
    },

    deleteProperty(headers, key) {
      if (headers.has(key)) {
        headers.delete(key);
      }
      return true;
    },

    has(headers, key) {
      return headers.has(key);
    },

    ownKeys(headers) {
      return headers.keys();
    },

    enumerate(headers) {
      return headers.keys();
    }
  });

  return proxy;
}

/**
 * Makes a proxy.
 *
 * @param      {<type>}  rawRequest       The raw request
 * @param      {<type>}  body             The body
 * @param      {<type>}  abortController  The abort controller
 * @return     {Proxy}   { description_of_the_return_value }
 */
function makeProxy(rawRequest, body, abortController) {
  return new Proxy(rawRequest, {
    get(target, key) {
      if (typeof target[key] === "function") {
        return new Proxy(target[key], {
          apply(method, thisArg, args) {
            return method.call(target, ...args);
          }
        });
      }

      switch (key) {
        case "raw":
          return rawRequest.raw ? rawRequest.raw : rawRequest;

        case "headers":
          return makeHeadersProxy(target[key]);

        case "abortController":
          return abortController;

        case "abortController":
          return abortController;

        case "params":
          const qstring = target.url.split("?")[1];
          if (qstring) {
            return qs.parse(qstring);
          } else {
            return null;
          }

        case "body":
          return body;

        default:
          return target[key];
      }
    },

    set(target, prop, value) {
      switch (prop) {
        case "headers":
          for (let key of target.headers.keys()) {
            target.headers.delete(key);
          }
          if (value && typeof value === "object") {
            Object.entries(value).forEach(([key, value]) => {
              target.headers.append(key, value);
            });
          }
          return true;

        default:
          target[prop] = value;
      }
    }
  });
}

/**
 * Creates a request.
 *
 * @param      {<type>}    config  The configuration
 * @return     {Function}  { description_of_the_return_value }
 */
export default function createRequest(config) {
  let fRequest = null;
  if (config instanceof Request) {
    const abortController = config.abortController || new AbortController();
    const rawRequest = new Request(config.url, {
      headers: config.headers,
      method: config.method,
      body: config.body,
      mode: config.mode,
      signal: abortController.signal
    });
    fRequest = makeProxy(rawRequest, config.body, abortController);
  } else {
    let { baseUri, path, mode, method, globalHeaders, headers, params, body, arrayFormat, abortController } = config;

    const fullUri = `${baseUri}${path}${params ? "?" + qs.stringify(params, { arrayFormat }) : ""}`;

    if (method) {
      method = method === "del" ? "DELETE" : method.toUpperCase();
    } else {
      method = "GET";
    }

    if (method !== "GET" && method !== "HEAD") {
      const isBinary = [Blob, FormData].reduce((acc, type) => body instanceof type);

      if (isBinary) {
        body = body;
      } else {
        body = JSON.stringify(body);
      }
    }

    const rawRequest = new Request(fullUri, {
      method,
      body,
      mode,
      signal: abortController.signal
    });

    fRequest = makeProxy(rawRequest, body, abortController);

    let allHeaders = Object.assign({}, globalHeaders, headers);

    fRequest.headers = allHeaders;
  }

  return fRequest;
}
