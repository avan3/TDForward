var customers = [
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_39ff2dc1-e430-4498-a645-155e83e05403", Name: ""}, // Caesar
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_c418b5e6-ef7a-4774-88bc-762f2e9adc53",}, // Jenny
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_9c8b689c-daec-4fe6-836d-07d36f9dbcc9",}, // Aubreanna
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_82d48a68-9d96-4815-9167-625041b6a132",}, // Phillipa
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_1e3a6b98-02b7-42da-99dc-1f8fa58bb012",}, 
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_e4af825b-3c1f-4429-9cf2-94c8f88ba62a"},
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_c18dca28-f10f-4a0a-b905-db636046bd4c"},
{ID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_be23d561-0198-4876-9d23-2a5e67bad5ff"}];
             
//recipients = [];
var self = {};
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

const teamToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiNWM1MGMwNzQtMzU3Mi0zZjQ5LWE2ZTgtZTNmMDNjNmMyN2ZjIiwiZXhwIjo5MjIzMzcyMDM2ODU0Nzc1LCJhcHBfaWQiOiIyMWY1NWNmMi02YTRkLTQxYTQtOGEwNS0zZmQ4ZmUzYWQ3MGIifQ.YJq6OHPXwdHJFI-JqderHB6R_wB1QggYmzcQjr_SThE";
const initialCustomerId = "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_6b87ce4d-1d72-4e48-8c76-6ba549a2a465";

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

self = (async () => {
  await req(options('GET', 'accounts/self'))
    .then((resp) => {
        console.log(resp.result.id);
      return resp.result;
    }, handleError)
})();

var transactionBody = {
  amount: 10,
  currency: "CAD",
  fromAccountID: "21f55cf2-6a4d-41a4-8a05-3fd8fe3ad70b_40c3e3d9-2b8a-45ff-aacc-af854c47afdb",
  receipt: "{ \"reason\": \"My half of the lunch bill\"}",
  toAccountID: "848c6bf4-d242-48cf-867f-1e6ec793e70a"
};


var cust = {};
(async () => {
  await req(options('POST', 'transfers/', transactionBody))
    .then((resp) => {
        cust = resp.result;
        console.log(cust.receipt);
        console.log(cust.transactionTime);
        console.log(cust.transactionType);
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
