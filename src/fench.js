import Interceptor from "./interceptor";
import createRequest from "./fRequest";
import createResponse from "./fResponse";

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
  // interceptor should be initialized after methods setup
  fench.interceptor = new Interceptor(fench, [...methods, "req"]);
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
        baseURI: this.opts.baseURI,
        globalHeaders: this.opts.headers,
        path: pathOrRequest,
        options,
        arrayFormat: this.opts.arrayFormat,
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
        reject(err);
      }
    });
  };

  fench.req = (abortSignal, request) => {
    return makeRequest(abortSignal, request);
  };

  methods.forEach(method => {
    fench[method] = setup(method);
  });

  return fench;
}

// class Fench {
//   constructor(
//     opts = {
//       parseErr: null,
//       headers: {},
//       baseURI: "",
//       arrayFormat: "indices",
//       auth: {},
//       timeout: 0,
//       body: {},
//       signal: null
//     },
//     fetchImpl = null
//   ) {
//     this.opts = opts;

//     this.fetch = fetchImpl || fetch.bind(global);

//     Object.defineProperty(this, "parseErr", {
//       enumerable: false,
//       value:
//         opts.parseErr ||
//         new Error(
//           `Invalid JSON received${opts.baseURI ? ` from ${opts.baseURI}` : ""}`
//         )
//     });

//     this.opts.arrayFormat = opts.arrayFormat;

//     methods.forEach(method => {
//       this[method] = this.setup(method);
//     });

//     this.req = (abortSignal, request) => {
//       return this.makeRequest(abortSignal, request);
//     };

//     // interceptor should be initialized after methods setup
//     this.interceptor = new Interceptor(this, [...methods, "req"]);
//     this.timeout = opts.timeout || 0;
//   }

//   // public auth(creds) {
//   //   if (typeof creds === "string") {
//   //     const index = creds.indexOf(":");
//   //     if (index !== -1)
//   //       creds = [creds.substr(0, index), creds.substr(index + 1)];
//   //   }

//   //   if (!Array.isArray(creds)) {
//   //     // eslint-disable-next-line prefer-rest-params
//   //     creds = [].slice.call(arguments);
//   //   }

//   //   switch (creds.length) {
//   //     case 0:
//   //       creds = ["", ""];
//   //       break;
//   //     case 1:
//   //       creds.push("");
//   //       break;
//   //     case 2:
//   //       break;
//   //     default:
//   //       throw new Error("auth option can only have two keys `[user, pass]`");
//   //   }

//   //   if (typeof creds[0] !== "string") {
//   //     throw new TypeError("auth option `user` must be a string");
//   //   }

//   //   if (typeof creds[1] !== "string") {
//   //     throw new TypeError("auth option `pass` must be a string");
//   //   }

//   //   if (!creds[0] && !creds[1]) {
//   //     delete this.headers.Authorization;
//   //   } else {
//   //     this.headers.Authorization = `Basic ${Buffer.from(
//   //       creds.join(":")
//   //     ).toString("base64")}`;
//   //   }

//   //   return this;
//   // }
//   // public req(abortSignal: AbortSignal, request: IFenchRequest) {
//   //   return this.makeRequest(abortSignal, request);
//   // }

//   jwt(token) {
//     if (token === null) {
//       delete this.opts.headers.Authorization;
//     } else if (typeof token === "string") {
//       this.opts.headers.Authorization = `Bearer ${token}`;
//     } else {
//       throw new TypeError("jwt token must be a string");
//     }

//     return this;
//   }

//   makeRequest(abortSignal, fRequest) {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const rawResponse = await this.fetch(fRequest.raw);
//         const fResponse = await createResponse(rawResponse, fRequest);

//         resolve(fResponse);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   }

//   prepareRequest(abortSignal, pathOrRequest = "/", options = {}) {
//     if (options && (typeof options !== "object" || Array.isArray(options))) {
//       throw new TypeError("`options` must be an object");
//     }
//     options = {
//       ...this.opts,
//       ...options
//     };

//     let fRequest = null;

//     if (pathOrRequest.headers) {
//       fRequest = pathOrRequest;
//     } else {
//       if (typeof pathOrRequest !== "string") {
//         throw new TypeError("`path` must be a string");
//       }

//       fRequest = createRequest({
//         baseURI: this.opts.baseURI,
//         globalHeaders: this.opts.headers,
//         path: pathOrRequest,
//         options,
//         arrayFormat: this.opts.arrayFormat,
//         abortSignal
//       });
//     }

//     return fRequest;
//   }

//   setup(method) {
//     return (abortSignal, pathOrRequest = "/", options = {}) => {
//       const request = this.prepareRequest(abortSignal, pathOrRequest, options);
//       return this.makeRequest(abortSignal, request);
//     };
//   }
// }

// export default Fench;
