
//var apiUrl = "https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST?language=de&mode=direct&name_dm=Chemnitz%2C+Robert-Siewert-Str&nameInfo_dm=36030050&type_dm=any&useRealtime=1&outputFormat=JSON";

function showAlert() {
    alert("Hi Masha!");
}

// function showTransport(transportType) {
//     generateTableForTransport(transportType);
// }

async function liGenerator() {
    try {
        const response = await fetch('http://localhost:3000/vms');
        const data = await response.json();
        let navBar = '<ul>';
        const transportsSet = new Set();
        data["departureList"].forEach(item => {
            if(!transportsSet.has(item["servingLine"]["name"])){
                navBar += `<li><button onclick="showTransport('${item["servingLine"]["name"]}')">${item["servingLine"]["name"]}</button></li>`;
            }
            transportsSet.add(item["servingLine"]["name"]);
        });
        navBar += '</ul>';
        const tableContainer = document.getElementById('ulli_container');
        tableContainer.innerHTML = navBar;
    } catch (error) {
        console.error(error);
    }
}

liGenerator();


async function showTransport(transportType) {
    try {
        const response = await fetch('http://localhost:3000/vms');
        //const response = await fetch("https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST?language=de&mode=direct&name_dm=Chemnitz%2C+Robert-Siewert-Str&nameInfo_dm=36030050&type_dm=any&useRealtime=1&outputFormat=JSON");
        const data = await response.json();
        let table = '<table>';
        table += `<caption><h3>${transportType}</h3></caption>`;
        table += '<tr><th>Number</th><th>Direction</th><th>Real Time</th><th>Scheduled Departure</th></tr>';
        data["departureList"].forEach(item => {
            if (item["servingLine"]["name"] === transportType) {
                table += presenceOfRealDate(item);
            }
        });

        table += '</table>';

        const tableContainer = document.getElementById('table_container');
        tableContainer.innerHTML = table;
    } catch (error) {
        console.error(error);
    }
}


function presenceOfRealDate (item){
    if (item["realDateTime"]){
        return `<tr><td>${item["servingLine"]["number"]}</td><td>${item["servingLine"]["direction"]}
</td><td>${item["realDateTime"]["hour"]}:${item["realDateTime"]["minute"]}</td><td>${item["dateTime"]["hour"]}:${item["dateTime"]["minute"]}</td></tr>`;
    } else {
        return `<tr><td>${item["servingLine"]["number"]}</td><td>${item["servingLine"]["direction"]}
</td><td>-</td><td>${item["dateTime"]["hour"]}:${item["dateTime"]["minute"]}</td></tr>`;
    }
}

async function generateTable() {
    try {
        const response = await fetch('http://localhost:3000/vms');
        //const response = await fetch("https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST?language=de&mode=direct&name_dm=Chemnitz%2C+Robert-Siewert-Str&nameInfo_dm=36030050&type_dm=any&useRealtime=1&outputFormat=JSON");
        const data = await response.json();
        let table = '<table>';
        let table2 = '<table>';
        table += '<caption><h3>Bus</h3></caption>';
        table2 += '<caption><h3>Tram</h3></caption>';
        table += '<tr><th>Number</th><th>Direction</th><th>Real Time</th><th>Scheduled Departure</th></tr>';
        table2 += '<tr><th>Number</th><th>Direction</th><th>Real Time</th><th>Scheduled Departure</th></tr>';
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

//generateTable();

