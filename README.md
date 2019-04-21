# Fennch [WIP][not ready]

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
        const result = await fetch(http://awesome.app/api/awesome-data?awesome=really&params=cool, {
            method: "GET"
        })
        return {
            ...response,
            body: await response.json() // if Content-Type is 'application/json'
        }
      #############################
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

```

```
