// Magically fetches any file from the webserver
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      result = xmlhttp.responseText;
    }
    return result;
}

// Random int between 0 and a max value
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// When an answer button is pressed, check if the answer is correct
function onAnswer(event){
    let button = event.target;
    if(button.dataset.correct == "true"){
        score += 1;
        console.log(score);
        button.style.backgroundColor = "green";
    }
    else {
        button.style.backgroundColor = "red";
    }
    let new_element = button.parentElement.parentElement.cloneNode(true);
    button.parentElement.parentElement.parentElement.replaceChild(new_element,button.parentElement.parentElement);
    button.removeEventListener("click",onAnswer);
    //button.parentElement.parentElement.removeEventListener("click",onAnswer);
    //button.parentElement.parentElement.parentElement.remove();
}

function checkAnswer(){
    document.getElementById("result").textContent = "You got: " + score + "/" + window.max_correct + "!";

    let pr = score / window.max_correct;

    if(pr <= 0.33){
        document.getElementById("comment").textContent = "Plain bad... but im not mad";
    }
    else if(pr <= 0.66) {
        document.getElementById("comment").textContent = "Thats kinda horrible but ok :)";
    }
    else{
        document.getElementById("comment").textContent = "Nice! Well done";
    }
}

var score = 0;

// Run this once when the site is loaded
window.onload = function(){

    document.getElementById("loading_info").remove();

    var questions_json = loadFile("./questions.json");
    if(questions_json == null) {
        alert("Error!!! questions.json could not be loaded");
    }
    else {
        // Loaded and read file, parse JSON
        var json = JSON.parse(questions_json);

        // Useful for code simplification
        var aLength = json["questions"].length;
        window.max_correct = aLength;

        // For every question...
        for (let index = 0; index < aLength; index++) {
            // Make a section div
            let qdiv = document.createElement("div");
            qdiv.className = "section";
            
            // Question title
            let question_title = document.createElement("h1");
            question_title.className = "text";
            question_title.textContent = `Spørsmål ${index + 1}`;

            // Question
            let question_question = document.createElement("h2");
            question_question.className = "text";
            question_question.textContent = `${json["questions"][index]["question"]}`

            // Div where answer buttons go
            let answer_container = document.createElement("div");
            answer_container.className = "answer_alternative_container";

            // For every answer alternative, increment by 2
            for (let i_ans = 0; i_ans < json["questions"][index]["alternatives"].length; i_ans = i_ans + 2){
                // Make alt_col div
                var alt_col = document.createElement("div");
                alt_col.className = "alt_col";

                // Create two buttons to not do if statements with modulo etc.
                let a_button_1 = document.createElement("button");
                a_button_1.className = "alternative";
                a_button_1.textContent = json["questions"][index]["alternatives"][i_ans]["text"];
                // Allows for cheating. Store if the question is correct in plaintext in the document
                a_button_1.dataset.correct = json["questions"][index]["alternatives"][i_ans]["correct"];
                a_button_1.addEventListener("click", onAnswer);


                let a_button_2 = document.createElement("button");
                a_button_2.className = "alternative";
                a_button_2.textContent = json["questions"][index]["alternatives"][i_ans+1]["text"];
                // Allows for cheating. Store if the question is correct in plaintext in the document
                a_button_2.dataset.correct = json["questions"][index]["alternatives"][i_ans+1]["correct"];
                a_button_2.addEventListener("click", onAnswer);

                // Add buttons to alt_col
                alt_col.append(a_button_1);
                alt_col.append(a_button_2);

                // Add button container to answer div
                answer_container.append(alt_col);
            }

            // Finish the question section
            qdiv.append(question_title);
            qdiv.append(question_question);
            qdiv.append(answer_container);

            // Add question to the document
            document.getElementById("section_question").appendChild(qdiv);
        }
    }
}