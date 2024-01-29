class Letter
{
    constructor(docElement, letter)
    {
        this.element = docElement;
        this.letter = letter;
        
        this.startAnimation = function()
        {
            this.element.classList.add("letterAnimated")
        }
        
        this.stopAnimation = function()
        {
            this.element.classList.remove("letterAnimated")
        }
        
        this.animate = function(animate)
        {
            if(animate)
            {
                this.startAnimation()
            }
            else
            {
                this.stopAnimation();
            }
        }

        this.validateKey = function(key)
        {
            return this.letter == key.toUpperCase();
        }
    }
}

function handleKeyPress(event)
{
    if(alphabet.includes(event.key.toUpperCase()))
    {
        if(gameActive)
        {
            if (activeLetter.validateKey(event.key.toUpperCase())) {
                score ++;
                generateNew();
            }
            else
            {
                loseGame();
            }
        }
        else
        {
            resultDiv.style.display = "none";
            leaderBoard.style.display = "none";
            registration.style.display = "none";
            gameActive = true;
            startTime = Date.now();
            generateNew();
        }
    }
}

function reloadScoreboard()
{
    scoreList.innerHTML = "Loading...";
    GJAPI.ScoreFetch(884021, GJAPI.SCORE_ALL, 10, updateScoreboard);
}

function updateScoreboard(pResponse)
{
    scoreList.innerHTML = "";
    if(!pResponse.scores) return;

    for(let i = 0; i < pResponse.scores.length; ++i)
    {
        const pScore = pResponse.scores[i];
        
        let el = document.createElement("li");
        el.innerHTML = (pScore.user ? pScore.user : pScore.guest) + " - " + pScore.score;

        scoreList.appendChild(el);
    }
}

function loseGame()
{
    if(gameActive)
    {
        endTime = Date.now();
        timeTakenElement.innerHTML = (endTime - startTime)/1000;
        scoreSpan.innerHTML = score;
        scorePercentage.innerHTML = Math.round(((score / Math.floor(Math.sqrt(maxTimeoutMS)))*100)*100) / 100;
        playerNameEl.innerHTML = playerName;
        resultDiv.style.display = "unset";
        leaderBoard.style.display = "unset";
        registration.style.display = "unset";
        gameActive = false;
        stopLettersAnimation();
        if (score > localHighscore)
        {
            localStorage.setItem("highscore", score);
            if (playerName == "Guest")
            {
                playerName = prompt("Type your name:");
                if (playerName == null) {playerName = "Guest"}
                localStorage.setItem("regname", playerName);
                playerNameEl.innerHTML = playerName;
            }
            else
            {
                alert("New high score!");
            }
            if (submitScores)
            {
                GJAPI.ScoreAddGuest(884021, score, `Score: ${score} Time: ${(endTime - startTime)/1000}`, playerName);
            }
            else
            {
                console.warn("Score submitting is off! No score was sent")
            }
            localHighscore = score;
        }
        lHighScore.innerHTML = localHighscore
        reloadScoreboard();
        score = 0;
    }
}

function loadLocalStorage()
{
    if (localStorage.getItem("regname") != null)
    {
        playerName = localStorage.getItem("regname");
        playerNameEl.innerHTML = playerName;
    }

    if (localStorage.getItem("highscore") != null)
    {
        localHighscore = localStorage.getItem("highscore");
    }
}

function stopLettersAnimation()
{
    for (let i = 0; i < docLetters.length; i++) {
        const letter = docLetters[i];
        
        letter.animate(false);
    }
}

// Generate a random array of letters, making sure that no entries are duplicated. Reset 'alphas' variable before calling again
function randomLetters(nLetters) 
{
    let letters = [];

    for (let i = 0; i < nLetters; i++)
    {
        let randIndex = Math.floor(Math.random() * alphas.length);
        letters.push(alphas[randIndex]);
        alphas.splice(randIndex, 1);
    }

    return letters
}

function getLetters()
{
    let l1 = new Letter(document.getElementById("letter1"), "");
    let l2 = new Letter(document.getElementById("letter2"), "");
    let l3 = new Letter(document.getElementById("letter3"), "");
    let l4 = new Letter(document.getElementById("letter4"), "");

    return [l1, l2, l3, l4];
}

function startGame()
{
    // Goes to end screen immediately
    //gameActive = true;
    //loseGame();

    title.style.display = "none";
    registration.style.display = "none"
    lettersEl.style.display = "flex";
    gameActive = true;
    generateNew();
}

function changeName()
{
    let input = prompt("Please type your new name");
    if(input != null)
    {
        playerName = input;
    }
    localStorage.setItem("regname", playerName);
    playerNameEl.innerHTML = playerName;
}

function generateNew()
{
    clearTimeout(timeoutID);

    alphas = alphabet.slice(0); // Copy array without "linking" them in memory (to my understanding)
    let generatedLetters = randomLetters(docLetters.length);
    activeLetter = docLetters[Math.floor(Math.random() * docLetters.length)];
    
    for (let i = 0; i < docLetters.length; i++) {
        const letter = docLetters[i];
        
        letter.element.innerHTML = generatedLetters[i];
        letter.letter = generatedLetters[i];
        letter.animate(false);
    }
    
    activeLetter.animate(true * gameActive); // generateNew may be called when the game isn't running, dont animate anything if this is the case
    
    currentStartTime = Date.now();
    timeoutID = setTimeout(loseGame, maxTimeoutMS / ((score / 25) + 1));
}

document.addEventListener("keydown", handleKeyPress);
let maxTimeoutMS = 5000;
let resultDiv = document.getElementById("result");
let scoreSpan = document.getElementById("scoreHere");
let scorePercentage = document.getElementById("scorePercentage");
let timeTakenElement = document.getElementById("timeTaken");
let scoreList = document.getElementById("scoreList");
let leaderBoard = document.getElementById("leaderboard");
let title = document.getElementById("title");
let lettersEl = document.getElementById("letters");
let registration = document.getElementById("registration");
let playerNameEl = document.getElementById("playerName");
let lHighScore = document.getElementById("lHighScore");
title.addEventListener("animationend", startGame,false);
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let gameActive = false;
let alphas = alphabet;
let docLetters = getLetters();
let currentStartTime = null;
let startTime = Date.now();
let endTime = null
let activeLetter = null;
let timeoutID = null;
let score = 0;
let localHighscore = 1;
let playerName = "Guest";
let submitScores = true;

loadLocalStorage();

//generateNew();