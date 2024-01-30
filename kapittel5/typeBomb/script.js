// Getting document elements
const mainGameDiv = document.getElementById("mainGameBox");
const notificationBox = document.getElementById("notificationBox");
const titleDiv = document.getElementById("titleDiv");
const scoreMenu = document.getElementById("scoreMenu");
const leaderboard = document.getElementById("leaderboard");
const gameMessageDiv = document.getElementById("gameMessageDiv");
const gameMessage = document.getElementById("gameMessage");
const lettersDiv = document.getElementById("letters");

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
let timeOutTime = 5000;

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
        startGame();
    }
}

function misTyped()
{
    takeGameInput = false;
    activeSymbol.setAnimation(false);
    lettersDiv.style.display = "none";
    displayGameMessage("Game over!");
    startMenu();
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

function setupGameChars(nChars)
{
    clearTimeout(loseTimeoutID);

    symbols = new Array();
    lettersDiv.innerHTML = "";
    let charList = pickRandomCharMulti(nChars);

    createSymbols(nChars, charList);  

    selectRandomChar();

    charItersWithoutRefresh ++;
    if(charItersWithoutRefresh >= 2)
    {
        resetAvailableChars();
        charItersWithoutRefresh = 0;
    }

    timeOutTime = 5000 / ((score/25) + 1);
    loseTimeoutID = setTimeout(misTyped, timeOutTime);
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

function startMenu()
{
    takeGameInput = false;
    showMenuElements(true);
    displayNotification("Tips", "You can restart immediately after a game over by pressing a key");
}

function startGame()
{
    setupGameChars(5);
    showMenuElements(false);
    lettersDiv.style.display = "flex";
    takeGameInput = true;
}

function init()
{
    titleDiv.style.display = "none";
    startMenu();
}

document.addEventListener("keydown", handleKeyPress);

showMenuElements(false);
titleDiv.style.display = "unset";
titleDiv.onanimationend = init;
