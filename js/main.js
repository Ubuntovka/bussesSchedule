
const apiUrlList = {"Robert-Siewert-Str": "https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST?language=de&mode=direct&name_dm=Chemnitz%2C+Robert-Siewert-Str&nameInfo_dm=36030050&type_dm=any&useRealtime=1&outputFormat=JSON",
                    "Morgenleite": "https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST?language=de&mode=direct&name_dm=Chemnitz%2C+Morgenleite&type_dm=any&nameInfo_dm=36030304&useRealtime=1&outputFormat=JSON"}

function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

var streetFromUrl = getParameterByName('street');
console.log(streetFromUrl);

const apiUrl = apiUrlList[streetFromUrl];

//const apiUrl = "https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST?language=de&mode=direct&name_dm=Chemnitz%2C+Robert-Siewert-Str&nameInfo_dm=36030050&type_dm=any&useRealtime=1&outputFormat=JSON";
//const apiUrl = 'http://localhost:3000/vms';
let currentTransportType;


async function fetchData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

function changeType(transportType) {
    currentTransportType = transportType;
    update();
}

async function update(){
    console.log("UPDATE");
    const data = await fetchData();
    liGenerator(data);
    showTransport(data);
}

async function liGenerator(data) {
    let navBar = '<ul class="filter-btn-row">';
    navBar += '<li></li>';
    const transportsSet = new Set();
    data["servingLines"].lines.forEach(item => {

        if(!transportsSet.has(item["mode"]["product"])){
            navBar += `<li><button class="filter-btn" onclick="changeType('${item["mode"]["product"]}')">${item["mode"]["product"]}</button></li>`;
        }
        transportsSet.add(item["mode"]["product"]);
    });
    navBar += '</ul>';
    const ulliContainer = document.getElementById('ulli_container');
    ulliContainer.innerHTML = navBar;
}

update();
setInterval(update, 1000);

// liGenerator();


async function showTransport(data) {
    let table = '<table>';
    table += `<caption><h3>${currentTransportType}</h3></caption>`;
    table += '<tr><th>Number</th><th>Direction</th><th>Time</th><th>Departure in</th></tr>';
    //
    let counter = true;
    data["departureList"].forEach(item => {
        if (item["servingLine"]["name"] === currentTransportType) {
            table += `<tr><td>${item["servingLine"]["number"]}</td><td>${item["servingLine"]["direction"]}</td>`;
            //table += presenceOfRealDate(item);
            // table += `<td>${presenceOfRealDate(item)}<br>${timeFormat(item["dateTime"]["hour"])}:${timeFormat(item["dateTime"]["minute"])}</td>`;
            table += `<td>${presenceOfRealDate(item)}<br>${timeFormat(item["dateTime"]["hour"], item["dateTime"]["minute"])}</td>`;
            table += `<td>${minutesToHours(item["countdown"])}</td></tr>`;
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
}


function minutesToHours(min){
    if(min <= 60){
        return min + " min.";
    } else {
        let hours = Math.floor(min / 60);
        let rest = min % 60;
        return hours + " h. " + rest + " min.";
    }

}

function timeFormat(hour, minute){
    return (hour < 10 ? '0' : '') + hour + ":" + (minute < 10 ? '0' : '') + minute;
}


function presenceOfRealDate (item){
    if (item["realDateTime"]){
        if (item["servingLine"]["delay"] > 0){
            return `<span class="real-time-delayed">${timeFormat(item["realDateTime"]["hour"], item["realDateTime"]["minute"])}</span>`;
        } else{
            return `<span class="real-time-not-delayed">${timeFormat(item["realDateTime"]["hour"], item["realDateTime"]["minute"])}</span>`;
        }
        
    } else {
        return `-`;
    }
}

