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
  headers?: { Authorization: string } & object;
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
  public req: any;

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

    this.opts.arrayFormat = opts.arrayFormat || "indices";

    methods.forEach(method => {
      this[method] = this.setup(method);
    });

    this.req = (abortSignal: AbortSignal, request: IFenchRequest) => {
      return this.makeRequest(abortSignal, request);
    };

    // interceptor should be initialized after methods setup
    this.interceptor = new Interceptor(this, [...methods, "req"]);
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
  // public req(abortSignal: AbortSignal, request: IFenchRequest) {
  //   return this.makeRequest(abortSignal, request);
  // }

  public jwt(token) {
    if (token === null) {
      delete this.opts.headers.Authorization;
    } else if (typeof token === "string") {
      this.opts.headers.Authorization = `Bearer ${token}`;
    } else {
      throw new TypeError("jwt token must be a string");
    }

    return this;
  }

  private makeRequest(abortSignal: AbortSignal, fRequest: IFenchRequest) {
    return new Promise(async (resolve, reject) => {
      try {
        const rawResponse = await fetch(fRequest.raw);
        const fResponse = await createResponse(rawResponse, fRequest);

        resolve(fResponse);
      } catch (err) {
        reject(err);
      }
    });
  }

  private prepareRequest(
    abortSignal,
    pathOrRequest = "/",
    options: FenchOptions
  ) {
    if (options && (typeof options !== "object" || Array.isArray(options))) {
      throw new TypeError("`options` must be an object");
    }
    options = {
      ...this.opts,
      ...options
    };

    let fRequest: any = null;

    const req = <IFenchRequest>(<unknown>pathOrRequest);
    // const req = pathOrRequest;
    if (req.headers) {
      fRequest = req;
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
  }

  private setup(method) {
    return (abortSignal, pathOrRequest = "/", options: FenchOptions) => {
      const request = this.prepareRequest(abortSignal, pathOrRequest, options);
      return this.makeRequest(abortSignal, request);
    };
  }
}

export default Fench;
