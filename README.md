# Fennch

Modern fetch-based HTTP client for the browser.

<h3 align="center">Fennch is:</h3>
<p align="center">
| <a href="#quickstart">fetch</a> + <a href="#request-abortion">request abortion</a> + <a href="timeout">timeout support</a> + <a href="#interceptors">request and response interceptions</a>
|</p>

_[Story](https://soal.red/fennch) about this library_

## Quickstart

### Basic usage

```js
import Fennch from "fennch";
const api = Fennch({
    baseUri: "http://awesome.app/api"
})
async function apiCall() {
    const result = await api.get("/awesome-data", {
        params: {
            awesome: "really",
            params: "cool"
        }
    });
    /* ###### Under the hood ######
        const result = await fetch("http://awesome.app/api/awesome-data?awesome=really&params=cool", {
            method: "GET"
        })
        return {
            ...response,
            body: await response.json() // if Content-Type is 'application/json'
        }
      #############################
    */
    /*
     `result` is a FResponse object which is Proxy that wraps native Response object.
     `result.headers` and `result.body` is already parsed and can accessed right away.
    */
    console.log(result.body) => /* => Awesome response! */
}
```

### Request abortion

```js
const api = Fennch({
  baseUri: "http://awesome.app/api"
});

const MySuperComponent = {
  currentRequest: null,

  handleUserAbort(req) {
    this.currentRequest.abort();
  },

  async apiCall() {
    this.currentRequest = api.get("/awesome-data", {
      params: {
        awesome: "really",
        params: "cool"
      }
    });
    let result;
    try {
      result = await currentRequest;
    } catch (err) {
      result = err;
    }
    return result;
  }
};

// I want make a request
MySuperComponent.apiCall()
  .then(res => res)
  .catch(err => {
    console.log(err); // => 'Request aborted'
  });

// Oh, wait, I changed my mind!
MySuperComponent.handleUserAbort();
```

### Timeout

### Interceptions

You can register any number of interceptors using `register()` method.
It returns function that can be used to unregister this interceptor.

```
const unregister = fennch.interceptor.register({
  request(request) {}, // Must return FRequest object, for example `request` that passed as an argument
  requestError(error) {},
  response(response) {}, // Must return FResponse object, for example `request` that passed as an argument
  responseError(error) {}
})

unregister()
```

Example:
```
const api = Fennch({
  baseUri: "http://awesome.app/api"
});

const unregister = api.interceptor.register({
  request(request) {
    /* Making some tweaks in request */
    /*...*/
    return request // Interceptor *must* return request 
  },
  requestError(request) {
    /* Making some tweaks in request */
    /*...*/
    return Promise.resolve(request)
  },
  response(response) {
    /* Making some tweaks in response */
    /*...*/
    return response // Interceptor *must* return response 
  },
  responseError(err) {
    /* If request is aborted adding `cancel` property to error */
    if (err.toString() === 'AbortError') {
      err.cancel = true
      return Promise.reject(err)
    }
    if (!err.response && err.message === 'Network Error') {
      err = networkErrorResolver(err)
      return Promise.resolve(err)
    }
    return err
  }
})

```
