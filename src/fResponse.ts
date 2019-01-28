import { IFenchRequest } from "./fRequest";

type ModernHeaders = Headers & {
  [Symbol.iterator](): Iterator<string[]>;
};

export interface IFenchResponse {
  body?: object | string | Blob;
  endpoint: string;
  err?: Error;
  headers: object;
  ok: boolean;
  raw: Response;
  request: IFenchRequest;
  status: number;
  statusText: string;
  type: string;
  url: string;
}

async function parseResponse(res: Response, contentType: string) {
  let body: any = null;
  let err: any = null;
  if (res.ok) {
    if (contentType && contentType.includes("application/json")) {
      try {
        if (typeof res.json === "function") {
          body = await res.json();
        } else {
          body = await res.text();
          body = JSON.parse(body);
        }
      } catch (err) {
        return err;
      }
    } else {
      body = await res.text();
    }
  } else {
    err = new Error(res.statusText);

    // check if the response was JSON, and if so, better the error
    if (contentType && contentType.includes("application/json")) {
      try {
        // // attempt to parse json body to use as error message
        if (typeof res.json === "function") {
          body = await res.json();
        } else {
          body = await res.text();
          body = JSON.parse(body);
        }

        // attempt to use better and human-friendly error messages
        if (typeof body === "object" && typeof body.message === "string") {
          err = new Error(body.message);
        } else if (
          !Array.isArray(body) &&
          // attempt to utilize Stripe-inspired error messages
          typeof body.error === "object"
        ) {
          if (body.error.message) {
            err = new Error(body.error.message);
          }
          if (body.error.stack) {
            err.stack = body.error.stack;
          }
          if (body.error.code) {
            err.code = body.error.code;
          }
          if (body.error.param) {
            err.param = body.error.param;
          }
        }
      } catch (e) {
        err = e;
      }
    }
  }
  return { body, err };
}

export default async function createResponse(
  rawResponse: Response,
  fRequest: IFenchRequest
): Promise<IFenchResponse> {
  const fResponse: IFenchResponse = {
    body: null,
    endpoint: fRequest.endpoint,
    headers: {},
    ok: rawResponse.ok,
    raw: rawResponse,
    request: fRequest,
    status: rawResponse.status,
    statusText: rawResponse.statusText,
    type: rawResponse.type,
    url: rawResponse.url
  };

  for (const [key, value] of rawResponse.headers as any) {
    fResponse.headers[key] = value;
  }

  const { body, err } = await parseResponse(
    rawResponse,
    rawResponse.headers.get("Content-Type")
  );

  if (err) {
    fResponse.err = err;
  }
  fResponse.body = body;
  return fResponse;
}
