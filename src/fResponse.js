async function parseResponse(res, contentType) {
  let body = null;
  let err = null;
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

export default async function createResponse(rawResponse, fRequest) {
  const fResponse = {
    body: null,
    path: fRequest.path,
    headers: {},
    err: null,
    ok: rawResponse.ok,
    raw: rawResponse,
    request: fRequest,
    status: rawResponse.status,
    statusText: rawResponse.statusText,
    type: rawResponse.type,
    url: rawResponse.url
  };

  for (const [key, value] of rawResponse.headers) {
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