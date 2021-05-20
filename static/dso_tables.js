/**
 * Fill the DSO api table from "https://api.data.amsterdam.nl/v1/"
 */

const domain = "https://api.data.amsterdam.nl";
const dsoPath = "/v1/";
const tableId = "dso-api-table";
const tableStatusId = "dso-table-status";

function tableFromJSON(json) {
    let table = document.getElementById(tableId);
    let statusRow = document.getElementById(tableStatusId);
    let datasets = json.datasets;

    for ( let name of Object.keys(datasets)) {
        dataset = datasets[name];
        let row = table.insertRow(-1);

        // Title column
        let cell1_Naam = row.insertCell(0);
        cell1_Naam.innerHTML = dataset.title || name;
        if(dataset.description) {
            cell1_Naam.title = dataset.description
            cell1_Naam.innerHTML += "<div class='info-icon' title='" + dataset.description + "'>?</div>"
        }
        if(dataset.terms_of_use.government_only) {
            cell1_Naam.innerHTML += "<div class='lock-icon' title='Alleen beschikbaar binnen de gemeente'>&#128274;</div>"
        }

        // Link column
        let cell2_link = row.insertCell(1);
        cell2_link.innerHTML = '<a href="' + dataset.api_url + '">Rest API</a> ';
        dataset.related_apis.forEach((relatedApi) => {
            cell2_link.innerHTML += '<a href="' + relatedApi.url + '">' + relatedApi.type + '</a> ';
        })

        // Documentation column
        let cell3_Docs = row.insertCell(2);
        cell3_Docs.innerHTML = '<a href="' + dataset.specification_url + '">Swagger</a>';
        cell3_Docs.innerHTML += ' of <a href="' + dataset.documentation_url + '.html">ReadTheDocs</a>';

        // Status column
        let cell4_Status = row.insertCell(3);
        cell4_Status.innerHTML = dataset.status;

        // License Column
        let cell5_Licentie = row.insertCell(4);
        if(dataset.terms_of_use.license == "Creative Commons, Naamsvermelding") {
            cell5_Licentie.innerHTML =
                '<a rel="license" href="https://creativecommons.org/licenses/by/4.0/">' +
                '<img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/88x31.png"' + 
                ' width="88" height="31"/></a>';
        }  else {
            cell5_Licentie.innerHTML = 
                '<a rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/">' +
                '<img src="https://i.creativecommons.org/p/zero/1.0/88x31.png" width="88" height="31" alt="Creative Commons License"/></a>'
        }      
    }
    statusRow.remove();
}

function JSONRequest(url, callback, err) {
    let http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4){
            if(this.status == 200) {
                let result = JSON.parse(this.responseText);
                return callback(result);
            } else {
                return err(this.response);
            }
        }
    };    
}

window.onload = () => {
    JSONRequest(domain + dsoPath + "?_format=json", tableFromJSON, (resp) => {
        let statusRow = document.getElementById(tableStatusId);
        statusRow.firstElementChild.innerText = "Kan datasets niet ophalen.";
    })
}