async function parseResponse(rawResponse) {
  let body = null;
  let error = null;

  if (rawResponse instanceof Response) {
    const contentType = rawResponse.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      try {
        if (typeof rawResponse.json === "function") {
          body = await rawResponse.json();
        } else {
          body = await rawResponse.text();
          body = JSON.parse(body);
        }
      } catch (err) {
        error = err;
      }
    }
  } else {
    error = rawResponse;
  }

  return { body, error };
}

export default async function createResponse(rawResponse, fRequest) {
  let { body, error } = await parseResponse(rawResponse);

  return new Proxy(rawResponse, {
    get(target, key) {
      switch (key) {
        case "request":
          return fRequest;

        case "body":
          return body;

        case "error":
          return error;

        case "raw":
          return rawResponse;

        default:
          return target[key];
      }
    },

    set(target, key, value) {
      if (key === "body") {
        body = value;
        return true;
      }
      return false;
    }
  });
}
