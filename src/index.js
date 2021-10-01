/**
 * @module     {Function} Fennch
 *
 * Fennch implements convenient API for making requests,
 * getting data from server responses and abort requests above native browser Fetch API.
 * It's API based heavily on Axios API design.
 *
 * This module exports fabric function that allows creating an instance of Fennch
 * with parameters used as defaults for requests made by this instance.
 *
 * On instance creation Fennch calls `setup()` function on every method in the methods list
 * and bind function returned from `setup()` to Fennch instance.
 * Each function sets up request method and options
 * and calls `fennch.req` that makes the actual request.
 * `fennch.req` can be called directly with Request or FRequest as an argument.
 * It can be useful when the user wants to repeat the request in the interceptor, for example.
 *
 * Request pipeline:
 * Request method of Fennch instance receives URI and options and call `prepareRequest()`,
 * which sets up request parameters, creates AbortController, and returns FRequest.
 * Resulted FRequest passed to `makeRequest` which returns AbortablePromise.
 * Inside Promise handler makes several operations:
 * 1. Pass FRequest to request interceptor which returns new FRequest
 * 2. Calls `fetch()` with raw Request from created FRequest
 * 3. Makes FResponse with the result of `fetch()` call
 * 4. Pass this FResponse to Response interceptor
 * 5. Resolves with FResponse returned from the interceptor
 * If `fetch()` rejected with an error, FResponse would be created from that error, and AbortablePromise rejected with this FRespnse.
 * If the request is aborted using `abort()` method of AbortablePromise,
 * the result also be rejected with FResponse contained "AbortError" object in `.error` property.
 *
 * Fennch uses native Proxy for implementing convenient access to request and response data.
 * `FRequest` and `FResponse` are native Request and Response objects wrapped with Proxy.
 * Resulted proxy holds original objects in `raw` property.
 * Special objects like `Body` and `Headers` can be read and write like regular Objects via that Proxy.
 */

import Interceptor from "./interceptor";
import AbortablePromise from "./abortablePromise";
import makeCreateResponse from "./fResponse";
import makeCreateRequest from "./fRequest";

const methods = ["get", "head", "post", "put", "del", "delete", "options", "patch"];

/**
 * { function_description }
 *
 * @class      Fennch (name)
 * @param      {<type>}                              opts       The options
 * @param {string} opts.baseUrl
 * @param {string} opts.mode
 * @param {string} opts.arrayFormat
 * @param {Object} opts.auth
 * @param {number} opts.timeout
 * @param {Object} fetchImpl
 * @param      {<type>}                              fetchImpl  The fetch implementation
 * @return     {(AbortablePromise|Function|string)}  { description_of_the_return_value }
 */
export default function Fennch(
  opts = {
    parseErr: null,
    headers: {},
    baseUri: "",
    mode: "cors",
    arrayFormat: "indices",
    auth: {},
    timeout: 0
  },
  fetchImpl = null
) {
  const fennch = {
    opts
  };

  const fetch = fetchImpl || globalThis.fetch;
  const Request = fetchImpl && fetchImpl.Request || globalThis.Request;
  const Response = fetchImpl && fetchImpl.Response || globalThis.Response;
  const Headers = fetchImpl && fetchImpl.Headers || globalThis.Headers;

  const createRequest = makeCreateRequest(Request, AbortController, AbortSignal);
  const createResponse = makeCreateResponse(Response);

  fennch.interceptor = Interceptor();

  const prepareRequest = (path = "/", options = {}) => {
    if (options && (typeof options !== "object" || Array.isArray(options))) {
      throw new TypeError("`options` must be an object");
    }

    options = {
      ...fennch.opts,
      ...options
    };
    if (typeof path !== "string") {
      throw new TypeError("`path` must be a string");
    }

    const abortController = new AbortController();

    const fRequest = createRequest({
      baseUri: options.baseUri,
      path,
      mode: options.mode,
      method: options.method,
      globalHeaders: fennch.opts.headers,
      headers: options.headers,
      params: options.params,
      body: options.body,
      arrayFormat: fennch.opts.arrayFormat,
      abortController
    });

    return fRequest;
  };

  const makeRequest = fRequest => {
    let isTimeoutExceeded = false
    const timeout = fRequest.timeout || fennch.opts.timeout;

    const promise = new AbortablePromise(async (resolve, reject) => {
      let timerId = null

      const makeTimeout = fReq => {
        return setTimeout(() => {
          isTimeoutExceeded = true
          fReq.abortController.abort()
        }, timeout);
      }

      const clonedFRequest = createRequest(fRequest)
      try {
        fRequest = await fennch.interceptor.interceptRequest(fRequest);
        let rawResponse = null;
        if (fetch === fetchImpl) {
          const symbols = Object.getOwnPropertySymbols(fRequest);
          const fullUri = fRequest[symbols[1]].parsedURL.href;
          if (timeout > 0) {
            timerId = makeTimeout(fRequest)
          }
          rawResponse = await fetch(fullUri, fRequest.raw);
          clearTimeout(timerId)
        } else {
          if (timeout > 0) {
            timerId = makeTimeout(fRequest)
          }
          const { cache, credentials, headers, integrity, mode, redirect, referrer, method, signal } = fRequest;
          const init = { cache, credentials, headers, integrity, mode, redirect, referrer, method, signal }

          if (fRequest.method.toLowerCase() !== "get" && fRequest.method.toLowerCase() !== "head") {
            if (fRequest.isBinary) {
              init.body = await fRequest.blob()
            } else {
              init.body = await fRequest.text()
            }
          }

          rawResponse = await fetch(fRequest.url, init);
          clearTimeout(timerId)
        }
        let fResponse = await createResponse(rawResponse, clonedFRequest);
        fResponse = await fennch.interceptor.interceptResponse(fRequest.abortController, fResponse);

        resolve(fResponse);
      } catch (err) {
        if (err.code === 20 && isTimeoutExceeded) {
          err = new Error("Timeout exceeded")
        }
        let fResponse;
        fResponse = await createResponse(err, clonedFRequest);
        try {
          fResponse = await fennch.interceptor.interceptResponseError(fRequest.abortController, fResponse);
          resolve(fResponse);
        } catch (err) {
          reject(err);

        }
      }
    }, fRequest.abortController);

    return promise;
  };

  const setup = method => {
    return (path = "/", options = {}) => {
      const request = prepareRequest(path, {
        ...options,
        method
      });
      return fennch.req(request);
    };
  };

  fennch.req = request => makeRequest(createRequest(request));

  methods.forEach(method => {
    fennch[method] = setup(method);
  });

  return fennch;
}

export const APromise = AbortablePromise;
export const makeCreateFResponse = makeCreateResponse;
export const makeCreateFRequest = makeCreateRequest;
