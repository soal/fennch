/**
 * Gets the type.
 *
 * @param      {Array}   contentType  The content type
 * @return     {string}  The type.
 */
function getType(contentType) {
  if (contentType.includes("json")) {
    return "json";
  } else if (contentType.includes("text")) {
    return "text";
  }
  return "blob";
}

/**
 * { function_description }
 *
 * @param      {<type>}   rawResponse  The raw response
 * @return     {Promise}  { description_of_the_return_value }
 */
async function parseResponse(rawResponse, Response) {
  let body = null;
  let error = null;

  if (rawResponse instanceof Response) {
    if (rawResponse.status === 204 && rawResponse.ok) {
      return { body, error };
    }
    const contentType = rawResponse.headers.get("Content-Type")
    if (contentType) {
      switch (getType(contentType)) {
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
      error = rawResponse
    }
  } else {
    error = rawResponse;
  }

  return { body, error };
}

export default function makeCreateResponse(Response) {
  return async (rawResponse, fRequest) => {
    let { body, error } = await parseResponse(rawResponse, Response);
    let cancel = false;
    if (rawResponse.name === "AbortError") {
      cancel = true;
    }

    return new Proxy(rawResponse, {
      get(target, key) {
        switch (key) {
          case "request":
            return fRequest;

          case "body":
            return body;

          case "cancel":
            return cancel;

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
        if (key === "cancel") {
          target.cancel = value;
          return true;
        }
        return false;
      }
    });
  };
}
