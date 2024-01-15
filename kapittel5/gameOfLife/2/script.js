let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lastTime = Date.now();
let timeTick = 1000;

let gameStateWidth = 20;
let gameStateHeight = 20;
let gameState0 = new Array(gameStateHeight);
let gameState1 = new Array(gameStateHeight);
initGamestate();

/*
    0 - empty
    1 - alive
    2 - food
*/

function mod(n, m) {
    return ((n % m) + m) % m;
}

function setGameState(n, x, y, value)
{
    if(n == 0)
    {
        gameState0[y][x] = value;
    }
    else
    {
        gameState1[y][x] = value;
    }
}

function getGameState(n, x, y, wrap)
{
    if(wrap)
    {
        x = mod(x, gameStateWidth);
        y = mod(y, gameStateHeight);
    }

    if(n == 0)
    {
        return gameState0[y][x];
    }
    else
    {
        return gameState1[y][x];
    }
}

function initGamestate()
{
    for (var i = 0; i < gameState0.length; i++)
    {
        gameState0[i] = new Array(gameStateWidth);
        gameState1[i] = new Array(gameStateWidth);
        for (let j = 0; j < gameState0[i].length; j++) {
            setGameState(0, j, i, Math.floor(Math.random() * 3));
            setGameState(1, j, i, getGameState(0, j, i, true));
        }
    }
}

function tick()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let yi = (canvas.height / gameState0.length);
    let xi = (canvas.width / gameState0[0].length);

    for (let y = 0; y < gameStateHeight; y++) {
        for (let x = 0; x < gameStateWidth; x++) {
            const value = getGameState(0, x, y, true)
            if(value == 1)
            {
                ctx.fillStyle = "#000000";
                ctx.fillRect(xi * x, yi * y, xi / 1.1, yi / 1.1);
            }
            else if(value == 2)
            {
                ctx.fillStyle = "#ff0000";
                ctx.fillRect(xi * x, yi * y, xi / 1.1, yi / 1.1);
            }
        }
        
    }
}

window.main = () =>
{
    window.requestAnimationFrame(main);
    
    if(Date.now() > lastTime + timeTick)
    {
        lastTime = Date.now();
        tick();
    }

}
main();