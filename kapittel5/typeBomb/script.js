const mainGameDiv = document.getElementById("mainGameBox");
const notificationBox = document.getElementById("notificationBox");
const titleDiv = document.getElementById("titleDiv");
const scoreMenu = document.getElementById("scoreMenu");
const leaderboard = document.getElementById("leaderboard");
const gameMessageDiv = document.getElementById("gameMessageDiv");
const gameMessage = document.getElementById("gameMessage");
const lettersDiv = document.getElementById("letters");

let symbols = new Array();

let isNotifying = false;
let isGameMessageActive = false;

class Symbol
{
    constructor(parentElement, symbol)
    {
        this.parentElement = parentElement;
        this.symbol = symbol;

        this.createElement = function()
        {
            let tempElement = document.createElement("div");
            tempElement.className = "letter";
            tempElement.innerHTML = this.symbol;
            this.parentElement.appendChild(tempElement);
        }
    }
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

function createSymbol()
{
    let symbol = new Symbol(lettersDiv, "A");
    symbol.createElement();
    symbols.push(symbol);
}

function createSymbols(nSymbols)
{
    for (let i = 0; i < nSymbols; i++)
    {
        createSymbol();
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

function showMenuElements(show)
{
    let displayStyle = boolToDisplayStyle(show);
    scoreMenu.style.display = displayStyle;
    leaderboard.style.display = displayStyle;
    titleDiv.style.display = displayStyle;
    notificationBox.style.display = boolToDisplayStyle(show * isNotifying);
    gameMessageDiv.style.display = boolToDisplayStyle(show * isGameMessageActive);
}

function startMenu()
{
    showMenuElements(true);
}

function startGame()
{
    symbols = new Array();
    createSymbols(5);
    showMenuElements(false);
}

function init()
{
    startMenu();
    displayGameMessage("gameMessage test");
}

showMenuElements(false);
titleDiv.style.display = "unset";
titleDiv.onanimationend = init;
