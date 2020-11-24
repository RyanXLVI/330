let displayTerm = "";
let resourceType = "";
let fields = "deck,description,name,developers,original_release_date";
let offset = 1;

function searchButtonClicked(){
    console.log("searchButtonClicked() called");

    const PROXY_SERVER = "https://people.rit.edu/rjs8915/330/project3/src/proxy.php?";

    let url = PROXY_SERVER;

    let term = document.querySelector("#searchTerm").value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    if(term.length < 1) return;

    url += 'q="' + term + '"';

    offset = 1;
    url += "&page=" + offset;

    url += "&field_list=" + fields;

    console.log(url);
    getData(url);
}

function nextButtonClicked(){
    offset += 1;

    const PROXY_SERVER = "https://people.rit.edu/rjs8915/330/project3/src/proxy.php?";

    let url = PROXY_SERVER;

    let term = document.querySelector("#searchTerm").value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    if(term.length < 1) return;

    url += "q=" + term;

    url += "&page=" + offset;

    url += "&field_list=" + fields;

    console.log(url);
    getData(url);
}

function getData(url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    let xhr = e.target;

    //console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    console.log(obj.results);

    if(!obj.results || obj.results.length == 0){
        document.querySelector("#content").innerHTML = "<b>No results found for " + displayTerm + "</b>";
        document.querySelector("#searchStatus").innerHTML = "";
        return;
    }

    let results = obj.results;
    console.log("results.length =" + results.length);
    let resultString = "<p><i>Here is one result of the term " + displayTerm + "</i></p>";
    document.querySelector("#searchStatus").innerHTML = resultString;

    console.log(results[0].name);
    let name = document.querySelector("#name");
    name.innerHTML = results[0].name;

    let summary = document.querySelector("#deck");
    if(results[0].deck == null){
        summary.innerHTML = "Summary: Not much is known about this game! Maybe you can figure it out";
    } else {
        summary.innerHTML = "Summary: " + results[0].deck;
    }
    
    let description = document.querySelector("#description");
    if(results[0].description == null){
        description.innerHTML = "Description: No description available";
    } else {
        description.innerHTML = "Description: " + results[0].description;
    }

    let date = document.querySelector("#date");
    if(results[0].original_release_date == null){
        date.innerHTML = "Release Date: No release date specified";
    } else {
        date.innerHTML = "Release Date: " + results[0].original_release_date;
    }

    let developers = document.querySelector("#developers");
    developers.innerHTML = "Developers: Currently not working on API (COMING SOON!)"; 
}

function dataError(e){
    console.log("An error occurred");
}

export {searchButtonClicked, nextButtonClicked};