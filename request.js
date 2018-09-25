var httpRequest;
var jsObj; 

window.onload = function() {
    makeRequest();
}
// Gets transactions in JSON object and populate table with information

function makeRequest() {
    httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', '/json', true);
    httpRequest.send(null);
    httpRequest.onreadystatechange = showContents;
}

function showContents() {
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            jsObj = JSON.parse(httpRequest.responseText);
            generateTable();
        }
        else {
            console.log("There is a problem with the request..");
        }
    }
    else {
        console.log("Not ready...");
    }
}

function generateTable(){
    var tbl = document.querySelector("#outputTable");
   // creating all table rows
   console.log(jsObj);
   for (var i = 0; i < jsObj.length; i++) {
       for (var j = 0; j < jsObj[i].length; ++j){
      // creates a table row
      var date = new Date(jsObj[i][j].originationDateTime).toLocaleDateString();
      
      var row = document.createElement("tr");
 
      // Create a <td> element and put them at the end of the table row
      row.appendChild(getRadioButton());
      row.appendChild(getTdElement(date));
      row.appendChild(getTdElement(jsObj[i][j].merchantName));
      row.appendChild(getTdElement(jsObj[i][j].categoryTags[0]));
      row.appendChild(getTdElement("$" + jsObj[i][j].currencyAmount));

 
      // add the row to the end of the table body
      tbl.appendChild(row);
   }
}
}

// Create a <td> element and a text
function getTdElement(text) {
   var cell = document.createElement("td");
//    cell.style.border = '1px solid #000';
   cell.style.padding = '5px';
   var cellText = document.createTextNode(text);
   cell.appendChild(cellText);
   return cell;
}

function getRadioButton() {
    var cell = document.createElement("td");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "radioButton";
    cell.appendChild(input);
    // cell.style.border = '1px solid #000';
    input.style.width = '100%';
    input.style.margin = '0 auto';
    return cell;
}