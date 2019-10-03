const fetch = require("node-fetch");
const Fennch = require("../../dist/fennch").fennch;
require("babel-polyfill");

const api = Fennch({
  baseUri: "http://localhost:3333", // optional
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  timeout: 5000
}, fetch);

async function makeFastRequest() {
  let result = "";
  result = await api.get("/fast", { params: { hello: "world" } });
  console.log("RESULT: ", result);
  console.log("RESULT MESSAGE: ", result.body.msg);
}

async function makeSlowRequest() {
  let result = "";
  try {
    const req = api.get("/slow");
    // result = await api.get("/slow");
    setTimeout(() => {
      req.abort();
    }, 2000)
    result = await req;
    console.log("RESULT: ", result);
    console.log("RESULT MESSAGE: ", result.body.msg);
  } catch(err) {
    console.log('SLOW REQUEST ERROR: ', err)
  }
}

makeFastRequest();
makeSlowRequest();
