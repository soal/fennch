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
function makeProxy(rawRequest, body, abortController, isBinary, url) {
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

        case "params":
          const qstring = target.url.split("?")[1];
          if (qstring) {
            return qs.parse(qstring);
          } else {
            return null;
          }

        case "body":
          return body;

        case "url":
          return url;

        case "isBinary":
          return isBinary;

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

export default function makeCreateRequest(Request, AbortController, AbortSignal) {
  return config => {
    let fRequest = null;
    if (config instanceof Request) {
      let abortController
      if (config.abortController && !config.abortController.signal.aborted) {
        abortController = config.abortController
      } else {
        abortController = new AbortController();
      }

      const abortSignalProto =
        abortController.signal &&
        typeof abortController.signal === "object" &&
        Object.getPrototypeOf(abortController.signal);

      if (abortSignalProto.constructor.name !== "AbortSignal") {
        // HACK: Inside node-fetch AbortSingnal type cheked by `name` of `abortSignalProto.constructor`.
        // It breaks after minimization, so we need to set `name` explicitly
        Object.defineProperty(abortSignalProto.constructor, "name", {
          value: "AbortSignal",
          configurable: true
        });
      }

      const clonedRawRequest = config.raw ? config.raw.clone() : config.clone();
      const rawRequest = new Request(clonedRawRequest, {
        signal: abortController.signal
      });
      fRequest = makeProxy(rawRequest, config.body, abortController, config.isBinary, config.url);
    } else {
      let { baseUri, path, mode, method, globalHeaders, headers, params, body, arrayFormat, abortController } = config;
      const fullUri = `${baseUri}${path}${params ? "?" + qs.stringify(params, { arrayFormat }) : ""}`;

      if (method) {
        method = method === "del" ? "DELETE" : method.toUpperCase();
      } else {
        method = "GET";
      }

      let isBinary = false
      if (method !== "GET" && method !== "HEAD") {
        const Blob = globalThis.Blob || null
        const FormData  = globalThis.FormData || null
        isBinary = [Blob, FormData].reduce((acc, type) => acc || (type && body instanceof type), false);

        if (!isBinary) {
          body = JSON.stringify(body);
        }
      }
      const abortSignalProto =
        abortController.signal &&
        typeof abortController.signal === "object" &&
        Object.getPrototypeOf(abortController.signal);
      if (abortSignalProto.constructor.name !== "AbortSignal") {
        // HACK: Inside node-fetch AbortSingnal type cheked by `name` of `abortSignalProto.constructor`.
        // It breaks after minimization, so we need to set `name` explicitly
        Object.defineProperty(abortSignalProto.constructor, "name", {
          value: "AbortSignal",
          configurable: true
        });
      }
      const rawRequest = new Request(fullUri, {
        method,
        body,
        mode,
        signal: abortController.signal
      });

      fRequest = makeProxy(rawRequest, body, abortController, isBinary, fullUri);

      let allHeaders = Object.assign({}, globalHeaders, headers);

      fRequest.headers = allHeaders;
    }

    return fRequest;
  };
}
