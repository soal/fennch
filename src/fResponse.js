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

async function getBody(rawResponse, type) {
  console.log("TYPE IN GET BODY", type)
  let body, error
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
  return { body, error }
}

/**
 * { function_description }
 *
 * @param      {<type>}   rawResponse  The raw response
 * @return     {Promise}  { description_of_the_return_value }
 */
async function parseResponse(rawResponse) {
  let body = null;
  let error = null;

  const Response = Response || null;
  if (Response && rawResponse instanceof Response) {
    if (rawResponse.status === 204 && rawResponse.ok) {
      return { body, error };
    }
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
  } else if (rawResponse instanceof Error) {
    error = rawResponse;
  } else {
    const parsed = await getBody(rawResponse, getType(rawResponse.headers.get("Content-Type")))
    console.log('DATA IN RESP NON_NATIVE:', parsed)
    return { body: parsed.body, error: parsed.error };
  }

  return { body, error };
}

/**
 * Creates a response.
 *
 * @param      {<type>}   rawResponse  The raw response
 * @param      {<type>}   fRequest     The f request
 * @return     {Promise}  { description_of_the_return_value }
 */
export default async function createResponse(rawResponse, fRequest) {
  let { body, error } = await parseResponse(rawResponse);
  console.log("RESPONSE DATA", body, error)
  let cancel = false;
  const DOMException = DOMException || null;
  // console.log('FRESPONSE: ', rawResponse, fRequest)
  if (DOMException && error && error instanceof DOMException && rawResponse.name === "AbortError") {
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
      return false;
    }
  });
}
