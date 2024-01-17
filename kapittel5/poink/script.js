const mainDiv = document.getElementById("game");
let canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
let activeCamera = null;

let mouseX = 0;
let mouseY = 0;
let mouseDelta = 0;

function handleMouseMove(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;
}

document.addEventListener("mousemove", handleMouseMove);

function handleMouseWheel(event)
{
    mouseDelta = event.deltaY;
}

document.addEventListener("wheel", handleMouseWheel);

function randomRGB()
{
    return `rgba(${64+Math.floor(Math.random()*128)}, ${64+Math.floor(Math.random()*128)}, ${64+Math.floor(Math.random()*128)}, 1.0);`
}

function makeBlockGrid(width, height, startX)
{
    let xi = (canvas.width / 3) / width;
    let yi = canvas.height / height;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++)
        {
            blocks.push(new Block(startX + (x * xi), y * yi, xi / 1.1, yi / 1.1));
        }
    }
}

function drawBlocks()
{
    blocks.forEach(block => {
        ctx.fillStyle = block.color;
        activeCamera.transformDrawRect(block);
    });
}

class Camera
{
    constructor(x, y, zoom)
    {
        this.x = x;
        this.y = y;
        this.zoom = zoom;
        this.targetFollowX = 0;
        this.targetFollowY = 0;
        this.followSmooth = 10;
        this.targetZoom = 1;

        this.translateCoord = function(x, y)
        {
            return [(canvas.width / 2) + ((x - this.x) * this.zoom), (canvas.height / 2) + ((y - this.y) * this.zoom)];
        }
        this.scaleCoord = function(x, y)
        {
            return [x * this.zoom, y * this.zoom];
        }

        this.smoothFollow = function()
        {
            this.x += (this.targetFollowX - this.x) / this.followSmooth;
            this.y += (this.targetFollowY - this.y) / this.followSmooth;
            this.zoom += (this.targetZoom - this.zoom) / this.followSmooth;
        }
        this.transformDrawRect = function(rect)
        {
            let newCoord = this.translateCoord(rect.x, rect.y);
            let newSize = this.scaleCoord(rect.width, rect.height);
            ctx.fillRect(newCoord[0], newCoord[1], newSize[0], newSize[1]);
        }
        this.transformDrawOutline = function(rect)
        {
            let newCoord = this.translateCoord(rect.x, rect.y);
            let newSize = this.scaleCoord(rect.width, rect.height);
            ctx.strokeRect(newCoord[0], newCoord[1], newSize[0], newSize[1]);
        }
    }
}

class Rect
{
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Block extends Rect
{
    constructor(x, y, width, height, health = 1)
    {
        super(x, y, width, height);
        this.health = health;
        this.color = randomRGB();
    }
}

class Paddle extends Rect
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height);
    }
}

window.main = () =>
{
    window.requestAnimationFrame(main);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBlocks();
    //mainCamera.targetFollowX = Math.sin(Date.now() / 100) * 100;
    mainCamera.targetFollowX = mouseX;
    mainCamera.targetFollowY = mouseY;

    activeCamera.transformDrawRect(playerPaddle);

    activeCamera.transformDrawOutline(gameArea);

    activeCamera.smoothFollow();

    ctx.stroke();
}

let mainCamera = new Camera(canvas.width / 2, canvas.height / 2, 1);
mainCamera.targetFollowX = canvas.width / 2;
mainCamera.targetFollowY = canvas.height / 2;
activeCamera = mainCamera;
let blocks = [];
makeBlockGrid(10,10,canvas.width / 2);
let playerPaddle = new Paddle((canvas.width / 12), 0, 32, (canvas.height / 6));
let gameArea = new Rect(0, 0, canvas.width, canvas.height);

main();