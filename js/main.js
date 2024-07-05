
const apiUrl = "https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST?language=de&mode=direct&name_dm=Chemnitz%2C+Robert-Siewert-Str&nameInfo_dm=36030050&type_dm=any&useRealtime=1&outputFormat=JSON";
//const apiUrl = 'http://localhost:3000/vms';

function showAlert() {
    alert("Hi Masha!");
}

async function liGenerator() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let navBar = '<ul class="filter-btn-row">';
        navBar += '<li></li>';
        const transportsSet = new Set();
        data["servingLines"].lines.forEach(item => {

            if(!transportsSet.has(item["mode"]["product"])){
                navBar += `<li><button class="filter-btn" onclick="showTransport('${item["mode"]["product"]}')">${item["mode"]["product"]}</button></li>`;
            }
            transportsSet.add(item["mode"]["product"]);
        });
        navBar += '</ul>';
        const ulliContainer = document.getElementById('ulli_container');
        ulliContainer.innerHTML = navBar;
    } catch (error) {
        console.error(error);
    }
}

liGenerator();


async function showTransport(transportType) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let table = '<table>';
        table += `<caption><h3>${transportType}</h3></caption>`;
        table += '<tr><th>Number</th><th>Direction</th><th>Real Time</th><th>Scheduled Departure</th></tr>';
        let counter = true;
        data["departureList"].forEach(item => {
            if (item["servingLine"]["name"] === transportType) {
                table += presenceOfRealDate(item);
                counter = false;
            }
        });

        const tableContainer = document.getElementById('table_container');
        const noTransportContainer = document.getElementById('no_transport_container');

        if(!counter){
            table += '</table>';
            tableContainer.innerHTML = table;
            noTransportContainer.innerHTML = "";
        } else {
            tableContainer.innerHTML = "";
            noTransportContainer.innerHTML = "<h3>No transport available</h3>";
        }



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
        const response = await fetch(apiUrl);
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

