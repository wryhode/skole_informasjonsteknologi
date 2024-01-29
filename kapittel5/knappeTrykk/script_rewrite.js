const possibleChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const resultDiv = document.getElementById("result");
const scoreSpan = document.getElementById("scoreHere");
const scorePercentage = document.getElementById("scorePercentage");
const timeTakenElement = document.getElementById("timeTaken");
const scoreList = document.getElementById("scoreList");
const leaderBoard = document.getElementById("leaderboard");
const title = document.getElementById("title");
const lettersEl = document.getElementById("letters");
const registration = document.getElementById("registration");
const playerNameEl = document.getElementById("playerName");
const lHighScore = document.getElementById("lHighScore");

class Letter
{
    constructor(docElement, letter)
    {
        this.element = docElement;
        this.letter = letter;
        
        // Generates a letter element in the DOM, useful if doing a dynamic letter amount
        this.generateElement = function(parent, id)
        {
            let tempEl = document.createElement("div");
            tempEl.id = id;
            tempEl.className = "gameLetter";
            parent.appendChild(tempEl);
        }

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

function startGame()
{

}

function stopGame()
{
    
}

function setup()
{
    document.addEventListener("keydown", handleKeyPress);
    title.addEventListener("animationend", startGame,false);
}

let availableChars = possibleChars;
let gameActive = false;
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