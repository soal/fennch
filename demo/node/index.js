const Fennch = require("../../dist/fennch").fennch;
const fetch = require("node-fetch");
require("babel-polyfill");
console.log(Fennch)

const api = Fennch({
  baseUri: "http://localhost:3333", // optional
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  timeout: 2000
}, fetch)

async function makeFastRequest() {
  let result = ""
  // try {
  result = await api.get("/fast");
  console.log("RESULT: ", result);
  console.log("RESULT MESSAGE: ", result.body.msg);
  // } catch (err) {
  //   console.log("ERROR!", err)
  //   result = err
  // }
}

makeFastRequest();
