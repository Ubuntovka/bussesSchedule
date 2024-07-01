
//var apiUrl = "https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST?language=de&mode=direct&name_dm=Chemnitz%2C+Robert-Siewert-Str&nameInfo_dm=36030050&type_dm=any&useRealtime=1&outputFormat=JSON";

function presenceOfRealDate (item){
    if (item["realDateTime"]){
        return `<tr><td>${item["servingLine"]["number"]}</td><td>${item["servingLine"]["direction"]}
</td><td>${item["realDateTime"]["hour"]}</td><td>${item["realDateTime"]["minute"]}</td></tr>`;
    } else {
        return `<tr><td>${item["servingLine"]["number"]}</td><td>${item["servingLine"]["direction"]}
</td><td>${item["dateTime"]["hour"]}</td><td>${item["dateTime"]["minute"]}</td></tr>`;
    }
}

async function generateTable() {
    try {
        const response = await fetch('http://localhost:3000/vms');
        const data = await response.json();
        let table = '<table><tr><th>Number</th><th>Direction</th><th>Hour</th><th>Minute</th></tr>';
        let table2 = "";
        table2 += table;
        data["departureList"].forEach(item => {
            if (item["servingLine"]["name"] === "Bus"){
                table += presenceOfRealDate(item);
            } else {
                table2 += presenceOfRealDate(item);
            }
        });

        table += '</table>';
        table2 += '</table>';

        const tableContainer = document.getElementById('table_container');
        tableContainer.innerHTML = table;
        tableContainer.innerHTML += table2;
    } catch (error) {
        console.error(error);
    }
}

generateTable();


/*var apiUrl = "http://localhost:3000/vms";
const number = document.getElementById('number');
const number2 = document.getElementById('number2');
const direction = document.getElementById('direction');
const direction2 = document.getElementById('direction2');
const hour = document.getElementById('hour');
const hour2 = document.getElementById('hour2');
const minute = document.getElementById('minute');
const minute2 = document.getElementById('minute2');

fetch(apiUrl)
  .then((res) => {
    return res.json();
  }).then((data) => {
  for (let i = 0; data["departureList"].length; i++) {
    if (data["departureList"][0]["servingLine"]["name"] === "Bus"){
      number.textContent = JSON.stringify(data["departureList"][i]["servingLine"]["number"]);
      direction.textContent = JSON.stringify(data["departureList"][i]["servingLine"]["direction"]);
      hour.textContent += JSON.stringify(data["departureList"][i]["realDateTime"]["hour"]);
      minute.textContent += JSON.stringify(data["departureList"][i]["realDateTime"]["minute"]);
    } else {
      number2.textContent = JSON.stringify(data["departureList"][i]["servingLine"]["number"]);
      direction2.textContent = JSON.stringify(data["departureList"][i]["servingLine"]["direction"]);
      hour2.textContent += JSON.stringify(data["departureList"][i]["realDateTime"]["hour"]);
      minute2.textContent += JSON.stringify(data["departureList"][i]["realDateTime"]["minute"]);
    }
  }


  })
  .catch((err) => console.debug(err)); */