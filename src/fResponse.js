function getType(contentType) {
  if (contentType.includes("json")) {
    return "json";
  } else if (contentType.includes("text")) {
    return "text";
  }
  return "blob";
}

async function parseResponse(rawResponse) {
  let body = null;
  let error = null;

  if (rawResponse instanceof Response) {
    const type = getType(rawResponse.headers.get("Content-Type"));
    switch (type) {
      case "json":
        try {
          body = await rawResponse.json();
        } catch (err) {
          error = err;
        }
        break;

      case "text":
        try {
          body = await rawResponse.text();
        } catch (err) {
          error = err;
        }
        break;

      default:
        try {
          body = await rawResponse.blob();
        } catch (err) {
          error = err;
        }
        break;
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
