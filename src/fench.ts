import Interceptor from "./interceptor";
import createRequest, { IFenchRequest } from "./fRequest";
import createResponse, { IFenchResponse } from "./fResponse";

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

type FenchOptions = RequestInit & {
  parseErr?: Error;
  headers?: object;
  baseURI?: string;
  raw?: boolean;
  arrayFormat?: string;
  auth?: object;
  timeout?: number;
  body?: object;
  signal?: object;
};

class Fench {
  public interceptor: object;
  public timeout: number;
  public parseErr?: Error;

  private opts: FenchOptions;
  private headers: object;
  private raw: boolean;
  private arrayFormat: string;

  constructor(opts: FenchOptions = {}) {
    this.opts = opts;

    Object.defineProperty(this, "parseErr", {
      enumerable: false,
      value:
        opts.parseErr ||
        new Error(
          `Invalid JSON received${opts.baseURI ? ` from ${opts.baseURI}` : ""}`
        )
    });

    this.headers = {
      ...opts.headers
    };

    this.opts.arrayFormat = opts.arrayFormat || "indices";

    // this.raw = opts.raw === true;

    // if (opts.auth) {
    //   this.auth(opts.auth);
    // }

    methods.forEach(method => {
      this[method] = this.setup(method);
    });

    // interceptor should be initialized after methods setup
    this.interceptor = new Interceptor(this, methods);
    this.timeout = opts.timeout || 0;
  }

  // public auth(creds) {
  //   if (typeof creds === "string") {
  //     const index = creds.indexOf(":");
  //     if (index !== -1)
  //       creds = [creds.substr(0, index), creds.substr(index + 1)];
  //   }

  //   if (!Array.isArray(creds)) {
  //     // eslint-disable-next-line prefer-rest-params
  //     creds = [].slice.call(arguments);
  //   }

  //   switch (creds.length) {
  //     case 0:
  //       creds = ["", ""];
  //       break;
  //     case 1:
  //       creds.push("");
  //       break;
  //     case 2:
  //       break;
  //     default:
  //       throw new Error("auth option can only have two keys `[user, pass]`");
  //   }

  //   if (typeof creds[0] !== "string") {
  //     throw new TypeError("auth option `user` must be a string");
  //   }

  //   if (typeof creds[1] !== "string") {
  //     throw new TypeError("auth option `pass` must be a string");
  //   }

  //   if (!creds[0] && !creds[1]) {
  //     delete this.headers.Authorization;
  //   } else {
  //     this.headers.Authorization = `Basic ${Buffer.from(
  //       creds.join(":")
  //     ).toString("base64")}`;
  //   }

  //   return this;
  // }

  // public jwt(token) {
  //   if (token === null) {
  //     delete this.headers.Authorization;
  //   } else if (typeof token === "string") {
  //     this.headers.Authorization = `Bearer ${token}`;
  //   } else {
  //     throw new TypeError("jwt token must be a string");
  //   }

  //   return this;
  // }

  private setup(method) {
    return (abortSignal, path = "/", options: FenchOptions) => {
      // path must be string
      if (typeof path !== "string") {
        throw new TypeError("`path` must be a string");
      }

      // otherwise check if its an object
      if (typeof options !== "object" || Array.isArray(options)) {
        throw new TypeError("`options` must be an object");
      }

      return new Promise(async (resolve, reject) => {
        try {
          const fRequest = createRequest({
            baseURI: this.opts.baseURI,
            globalHeaders: this.opts.headers,
            path,
            options,
            arrayFormat: this.opts.arrayFormat,
            abortSignal
          });

          const rawResponse = await fetch(fRequest.raw);
          const fResponse = await createResponse(rawResponse, fRequest);

          resolve(fResponse);
        } catch (err) {
          reject(err);
        }
      });
    };
  }
}

export default Fench;
