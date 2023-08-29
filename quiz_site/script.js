// Magically fetches any file from the webserver
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
}

// Random int between 0 and a max value
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Run this once 
window.onload = function(){
var questions_json = loadFile("./questions.json");
    if(questions_json == null) {
        alert("Error!!! questions.json could not be loaded");
    }
    else {
        // Loaded and read file, parse JSON
        var json = JSON.parse(questions_json);
        console.log(json)
        // Useful for code simplification
        var aLength = json["questions"].length;
        for (let index = 0; index < aLength; index++) {
            var toWrite = `
            <div class="section">
                <h1 class="text">Spørsmål ${index + 1}</h1>
                <h2 class="text">${json["questions"][index]["question"]}</h2>
                <div class="answer_alternative_container">
                    <div class="alt_col">`;

            for (let j = 0; j < json["questions"][index]["alternatives"].length; j++) {
                if(j != 0 && j % 2 == 0){
                    toWrite += `</div>
                        <div class="alt_col">`;        
                }
                toWrite += `<button class="alternative">${json["questions"][index]["alternatives"][j]["text"]}</button>`;
            }
            toWrite += `</div>`;

/*                    <div class="alt_col">
                        <button class="alternative">${json["questions"][index]["alternatives"][2]["text"]}</button>
                        <button class="alternative">${json["questions"][index]["alternatives"][3]["text"]}</button>
                    </div>   
                </div>`;*/
            
            document.getElementById("section_question").innerHTML += toWrite;
        }
    }
}