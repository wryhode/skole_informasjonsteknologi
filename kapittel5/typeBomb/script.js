// Getting document elements
const mainGameDiv = document.getElementById("mainGameBox");
const notificationBox = document.getElementById("notificationBox");
const titleDiv = document.getElementById("titleDiv");
const scoreMenu = document.getElementById("scoreMenu");
const leaderboard = document.getElementById("leaderboard");
const gameMessageDiv = document.getElementById("gameMessageDiv");
const gameMessage = document.getElementById("gameMessage");
const lettersDiv = document.getElementById("letters");
const timeoutDuration = document.getElementById("timeoutDuration");
const dyslexiaButton = document.getElementById("dyslexiaButton");
const resetHighscoreButton = document.getElementById("resetHighscoreButton");
const renameButton = document.getElementById("renameButton");
const scoreCounter = document.getElementById("scoreCounter");
const highscoreCounter = document.getElementById("highscoreCounter");
const leaderboardList = document.getElementById("leaderboardList");

const charset = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let availableCharset = charset.slice(0);
let charItersWithoutRefresh = 0;
let symbols = new Array();
let activeSymbol = null;
let isNotifying = false;
let isGameMessageActive = false;
let takeGameInput = false;
let loseTimeoutID = null
let score = 0;
let highScore = 0;
let timeOutTime = 5000;
let dyslexiaMode = false;
let playerName = "Guest";

class Symbol
{
    constructor(parentElement, symbol)
    {
        this.parentElement = parentElement;
        this.element = null
        this.symbol = symbol;

        this.createElement = function()
        {
            this.element = document.createElement("div");
            this.element.className = "letter";
            this.element.innerHTML = this.symbol;
            this.parentElement.appendChild(this.element);
        }

        this.setAnimation = function(animate)
        {
            if(animate)
            {
                this.element.classList.add("blinkingLetter");
            }
            else
            {
                this.element.classList.remove("blinkingLetter");
            }
        }
    }
}

function handleKeyPress(event)
{
    const key = event.key;
    const gameKey = key.toUpperCase();
    let specials = event.ctrlKey | event.shiftKey | event.altKey;

    if(takeGameInput)
    {
        if(charset.includes(gameKey))
        {
            if(gameKey == activeSymbol.symbol)
            {
                setupGameChars(5);
                score ++;
            }
            else
            {
                misTyped();
            }
        }
    }
    else
    {
        if(charset.includes(gameKey) && !specials)
        {
            startGame();
        }
    }
}

function misTyped()
{
    takeGameInput = false;
    activeSymbol.setAnimation(false);
    lettersDiv.style.display = "none";
    scoreCounter.innerHTML = score;
    highscoreCounter.innerHTML = highScore;
    if(score > highScore)
    {
        highScore = score;
        saveToLocalStorage();
        GJAPI.ScoreAddGuest(885603, score, `Score: ${score}`, playerName);
    }
    saveToLocalStorage();
    GJAPI.ScoreFetch(885603, GJAPI.SCORE_ALL, 10, updateScoreboard);
    displayGameMessage("Game over!");
    startMenu();
}

function updateScoreboard(pResponse)
{
    leaderboardList.innerHTML = "";
    if(!pResponse.scores) return;

    for(let i = 0; i < pResponse.scores.length; ++i)
    {
        const pScore = pResponse.scores[i];
        
        let el = document.createElement("li");
        el.innerHTML = (pScore.user ? pScore.user : pScore.guest) + " - " + pScore.score;

        leaderboardList.appendChild(el);
    }
}

function resetAvailableChars()
{
    availableCharset = charset.slice(0);
}

function pickRandomChar()
{
    let randomIndex = Math.floor(Math.random() * availableCharset.length);
    let char = availableCharset[randomIndex];
    availableCharset.splice(randomIndex, 1);
    return char;
}

function pickRandomCharMulti(nChars)
{
    let pickedChars = new Array();
    for(let i = 0; i < nChars; i ++)
    {
        pickedChars.push(pickRandomChar());
    }
    return pickedChars;
}

function hideNotification()
{
    isNotifying = false;
    notificationBox.style.display = boolToDisplayStyle(isNotifying);
}

function displayNotification(title, message)
{
    notificationBox.innerHTML = "";
    let titleElement = document.createElement("h1");
    titleElement.innerHTML = title;
    let contentElement = document.createElement("p");
    contentElement.innerHTML = message;
    notificationBox.appendChild(titleElement);
    notificationBox.appendChild(contentElement);
    isNotifying = true;
    notificationBox.style.display = boolToDisplayStyle(isNotifying);
    notificationBox.addEventListener("animationend", hideNotification)
}

function hideGameMessage()
{
    isGameMessageActive = false;
    gameMessageDiv.style.display = boolToDisplayStyle(false);
}

function displayGameMessage(message, fadeTime = 5000)
{
    gameMessage.innerHTML = message;
    isGameMessageActive = true;
    gameMessageDiv.style.display = boolToDisplayStyle(isGameMessageActive);
    gameMessageDiv.addEventListener("animationend", hideGameMessage);
}

function createSymbol(symbol = "A")
{
    let symbolEl = new Symbol(lettersDiv, symbol);
    symbolEl.createElement();
    symbols.push(symbolEl);
}

function createSymbols(nSymbols, symbols)
{
    for (let i = 0; i < nSymbols; i++)
    {
        createSymbol(symbols[i]);
    }
}

function boolToDisplayStyle(show)
{
    if(show)
    {
        return "unset";
    }
    else
    {
        return "none";
    }
}

function saveToLocalStorage()
{
    localStorage.setItem("highscore", highScore);
    localStorage.setItem("username", playerName);
}

function loadFromLocalStorage()
{
    highScore = localStorage.getItem("highscore");
    playerName = localStorage.getItem("username");
}

function setupGameChars(nChars)
{
    clearTimeout(loseTimeoutID);

    if(dyslexiaMode)
    {
        lettersDiv.style.fontSize = "1rem";
        lettersDiv.style.fontFamily = "A Cursive"
        nChars = charset.length;
    }
    else
    {
        lettersDiv.style.fontSize = "10rem";
        lettersDiv.style.fontFamily = "Monospace"
    }

    symbols = new Array();
    lettersDiv.innerHTML = "";
    let charList = pickRandomCharMulti(nChars);

    createSymbols(nChars, charList);  

    selectRandomChar();

    charItersWithoutRefresh ++;
    if(charItersWithoutRefresh >= 2 - dyslexiaMode)
    {
        resetAvailableChars();
        charItersWithoutRefresh = 0;
    }

    timeOutTime = 5000 / ((score/25) + 1);
    loseTimeoutID = setTimeout(misTyped, timeOutTime);
}

function toggleDyslexiaMode()
{
    dyslexiaMode = !dyslexiaMode;
    if(dyslexiaMode)
    {
        displayNotification("Info", "Dyslexia mode is on. (Good luck)")
    }
    else
    {
        displayNotification("Info", "Dyslexia mode is off. (Good luck)")
    }
}

function selectRandomChar()
{
    let whichChar = Math.floor(Math.random() * symbols.length);
    activeSymbol = symbols[whichChar];
    
    activeSymbol.setAnimation(true);
}

function showMenuElements(show)
{
    let displayStyle = boolToDisplayStyle(show);
    scoreMenu.style.display = displayStyle;
    leaderboard.style.display = displayStyle;
    notificationBox.style.display = boolToDisplayStyle(show * isNotifying);
    gameMessageDiv.style.display = boolToDisplayStyle(show * isGameMessageActive);
}

function rename()
{
    let input = prompt("New name");
    if(input != null)
    {
        playerName = input;
        saveToLocalStorage();
        displayNotification("Info", `Changed name to: ${playerName}`);
    }
}

function resetHighscore()
{
    highScore = 0;
    highscoreCounter.innerHTML = highScore;
    saveToLocalStorage();
    displayNotification("Info", "Reset the local high score");
}

function startMenu()
{
    takeGameInput = false;
    showMenuElements(true);
    displayNotification("Tips", "You can restart immediately after a game over by pressing a key");
}

function startGame()
{
    score = 0;
    setupGameChars(5);
    showMenuElements(false);
    lettersDiv.style.display = "flex";
    takeGameInput = true;
}

function init()
{
    GJAPI.ScoreFetch(885603, GJAPI.SCORE_ALL, 10, updateScoreboard);
    titleDiv.style.display = "none";
    scoreCounter.innerHTML = score;
    highscoreCounter.innerHTML = highScore;
    startMenu();
}

loadFromLocalStorage();
document.addEventListener("keydown", handleKeyPress);
dyslexiaButton.onclick = toggleDyslexiaMode;
renameButton.onclick = rename;
resetHighscoreButton.onclick = resetHighscore;
showMenuElements(false);
titleDiv.style.display = "unset";
titleDiv.onanimationend = init;
