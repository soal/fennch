const fetch = require("node-fetch");
const Fennch = require("../../dist/fennch").fennch;
require("babel-polyfill");
console.log(Fennch);

const api = Fennch({
  baseUri: "http://localhost:3333", // optional
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  timeout: 20000
}, fetch);

async function makeFastRequest() {
  let result = "";
  result = await api.get("/fast", { params: { hello: "world" } });
  console.log("RESULT: ", result);
  console.log("RESULT MESSAGE: ", result.body.msg);
}

async function makeSlowRequest() {
  let result = "";
  result = await api.get("/slow");
  console.log("RESULT: ", result);
  console.log("RESULT MESSAGE: ", result.body.msg);
}

makeFastRequest();
makeSlowRequest();
