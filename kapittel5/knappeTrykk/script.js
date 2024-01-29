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
            gameActive = true;
            generateNew();
        }
    }
}

function loseGame()
{
    if(gameActive)
    {
        scoreSpan.innerHTML = score
        scorePercentage.innerHTML = Math.round(((score / Math.floor(Math.sqrt(maxTimeoutMS)))*100)*100) / 100
        resultDiv.style.display = "unset";
        gameActive = false;
        stopLettersAnimation();
        score = 0;
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

function generateNew()
{
    clearTimeout(timeoutID);

    alphas = alphabet.slice(0); // Copy array without "linking" them in memory
    let generatedLetters = randomLetters(docLetters.length);
    activeLetter = docLetters[Math.floor(Math.random() * docLetters.length)];
    
    for (let i = 0; i < docLetters.length; i++) {
        const letter = docLetters[i];
        
        letter.element.innerHTML = generatedLetters[i];
        letter.letter = generatedLetters[i];
        letter.animate(false);
    }
    
    activeLetter.animate(true * gameActive);
    
    timeoutID = setTimeout(loseGame, maxTimeoutMS - Math.pow(score, 2));
    
}

document.addEventListener("keydown", handleKeyPress);
let maxTimeoutMS = 2500;
let resultDiv = document.getElementById("result");
let scoreSpan = document.getElementById("scoreHere");
let scorePercentage = document.getElementById("scorePercentage");
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let gameActive = true;
let alphas = alphabet;
let docLetters = getLetters();
let activeLetter = null;
let timeoutID = null;
let score = 0;

generateNew();