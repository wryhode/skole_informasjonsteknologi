// Magically fetches the json file
fetch("./questions.json").then(response => response.json()).then(json => console.log(json));

