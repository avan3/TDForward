var customers = [
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_39ff2dc1-e430-4498-a645-155e83e05403", Name: ""},
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_c418b5e6-ef7a-4774-88bc-762f2e9adc53", Name: ""},
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_9c8b689c-daec-4fe6-836d-07d36f9dbcc9", Name: ""},
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_82d48a68-9d96-4815-9167-625041b6a132", Name: ""}
];

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

const teamToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiNWM1MGMwNzQtMzU3Mi0zZjQ5LWE2ZTgtZTNmMDNjNmMyN2ZjIiwiZXhwIjo5MjIzMzcyMDM2ODU0Nzc1LCJhcHBfaWQiOiIyMWY1NWNmMi02YTRkLTQxYTQtOGEwNS0zZmQ4ZmUzYWQ3MGIifQ.YJq6OHPXwdHJFI-JqderHB6R_wB1QggYmzcQjr_SThE";
const initialCustomerId = "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_39ff2dc1-e430-4498-a645-155e83e05403";

const util = require('util') // for printing objects
const req = require('request-promise-native'); // use Request library + promises to reduce lines of code

function options(method, uri, body = null) {
  return {
    json: true,
    body: body,
    uri: 'https://api.td-davinci.com/api/' + uri,
    method: method,
    headers: { 'Authorization': teamToken }
  };
}
var cust;
(async () => {
  await req(options('GET', 'customers/' + initialCustomerId))
    .then((resp) => {
      cust = resp.result;
      console.log(cust.givenName);
    }, handleError)
})();

app.get("/", (req, res) => {
    res.send(cust.givenName);
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, function(){
  console.log("Server running on: " + HTTP_PORT);
});

function handleError(err) {
  let outErr = err;
  if (err.response) {
    if (err.response.body) {
      outErr = err.response.body;
      console.dir(outErr.errorDetails);
    } else {
      outErr = err.response;
    }
  }
  console.dir(outErr);
  process.exit(1);
}
