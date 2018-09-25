var express = require("express");
var fs = require('fs');
var bodyParser = require("body-parser");
var path = require('path');

var HTTP_PORT = process.env.PORT || 8080;

var app = express();
app.use(express.static('public'));

var dataM = require(__dirname + '/dataManagement.js');
var allData = [];
var preference;

// Global Variables
var AGE_MAX;
var AGE_MIN;

var INC_MIN;
var INC_MAX;

var WORK;

var CATEGORY;



app.use(bodyParser.urlencoded({
  extended: true
}));

// Initial page (Terms of Service)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/term.html'));
  console.log(allData[0].length);
});

// Main page with drop down menus
app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname + '/main.html'));
});

// JSON file sent to the browser
app.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname + '/transactions.json'))
});

// Saves transaction array into file and open next page to list transactions
app.post('/', (req, res) => {
  preference = req.body;
  console.log(preference);
  applyFilters(); // checks preferences to set global variables (see below)

  var filteredCustomers = [];
  var filteredCustomerTransactions = [];
  var counter = 0;
  var good;
  for (var i = 0; i < allData.length; ++i) {
    good = false;
    if (allData[0][i].age <= AGE_MAX &&
        allData[0][i].age >= AGE_MIN &&
       (allData[0][i].workActivity == WORK || WORK == 'ALL') &&
        allData[0][i].totalIncome <= INC_MAX &&
        allData[0][i].totalIncome >= INC_MIN) {
          var temp = [];
          for (var k = 0; k < allData[1][i].length; ++k) {
            if ((allData[1][i][k].categoryTags[0] == CATEGORY || CATEGORY == 'ALL')) {
              //console.log(CATEGORY);
              //console.log("hello again sailor");
              filteredCustomers[counter] = allData[0][i]; // store matched customer
              temp.push(allData[1][i][k]);
              //filteredCustomerTransactions[counter].push(allData[1][i][k]); // store macthed customer transactions
              good = true;
              //console.log(temp);
              }
            }
      //console.log(allData[0][i].givenName);
      
      if (good) {filteredCustomerTransactions.push(temp); ++counter; console.log(filteredCustomerTransactions)}
    }
  }

  fs.writeFile('transactions.json', JSON.stringify(filteredCustomerTransactions), function (err) {
    if (err) throw err;
  });
  res.sendFile(__dirname + '/transaction.html');
});

var final;
app.post('/submission', (req, res) => {
  res.sendFile(__dirname + '/congrats.html');
});

var applyFilters = function () {
  // Age
  //console.log("apply filters!");
  switch (preference.forward_pref1) {
    case "a1":
      AGE_MAX = 200;
      AGE_MIN = 0;
      break;
    case "a2":
      AGE_MAX = 18;
      AGE_MIN = 12;
      break;
    case "a3":
      AGE_MAX = 24;
      AGE_MIN = 19;
      break;
    case "a4":
      AGE_MAX = 34;
      AGE_MIN = 25;
      break;
    case "a5":
      AGE_MAX = 44;
      AGE_MIN = 35;
      break;
    case "a6":
      AGE_MAX = 54;
      AGE_MIN = 45;
      break;
    case "a7":
      AGE_MAX = 64;
      AGE_MIN = 55;
      break;
    case "a8":
      AGE_MAX = 200;
      AGE_MIN = 65;
      break;
    default:
      AGE_MAX = 200;
      AGE_MIN = 0;
  }

  // Work
  switch (preference.forward_pref2) {
    case "w1":
      WORK = 'ALL';
      break;
    case "w2":
      WORK = 'fullTime';
      break;
    case "w3":
      WORK = 'partTime';
      break;
    case "w4":
      WORK = 'null';
    default:
      WORK = 'ALL'; //
  }

  // Income
  switch (preference.forward_pref3) {
    case "i1":
      INC_MAX = 1000000000;
      INC_MIN = 0;
      break;
    case "i2":
      INC_MAX = 19999;
      INC_MIN = 0;
      break;
    case "i3":
      INC_MAX = 34999;
      INC_MIN = 20000;
      break;
    case "i4":
      INC_MAX = 49999;
      INC_MIN = 35000;
      break;
    case "i5":
      INC_MAX = 74999;
      INC_MIN = 50000;
      break;
    case "i6":
      INC_MAX = 99999;
      INC_MIN = 75000;
      break;
    default:
      INC_MAX = 100000000000;
      INC_MIN = 0;
  }

  // Category
  switch (preference.tag) {
    case "t1":
      CATEGORY = 'Auto and Transport';
      break;
    case "t2":
      CATEGORY = 'Bills and Utilities';
      break;
    case "t3":
      CATEGORY = 'Entertainment';
      break;
    case "t4":
      CATEGORY = 'Food and Dining';
      break;
    case "t5":
      CATEGORY = 'Mortgage and Rent';
      break;
    case "t6":
      CATEGORY = 'Shopping';
    default:
      CATEGORY = 'ALL';
  }
}




// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, function () {
  console.log("Server running on port: " + HTTP_PORT);
  dataM.loadData()
    .then(function (resp) {
      allData = resp;
    });
});