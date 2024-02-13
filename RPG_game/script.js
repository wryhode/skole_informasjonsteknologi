class Camera
{
    constructor(x, y, zoom)
    {
        this.x = x;
        this.y = y;
        this.targetEntity;
        this.zoom = zoom;

        this.translateCoord = function(x, y)
        {
            return [(x* this.zoom) - this.x , (y* this.zoom) - this.y ];
        }

        this.scaleSize = function(sizeX, sizeY)
        {
            return [sizeX * this.zoom, sizeY * this.zoom];
        }

        this.centerOnEntity = function(entity)
        {
            this.x = entity.centerX - gameCanvas.width / 2;
            this.y = entity.centerY - gameCanvas.height / 2;
        }
    }
}

class Entity
{
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.distanceToEntity = function(entity)
        {
            return Math.sqrt(Math.pow(entity.centerX - this.centerX,2) + Math.pow(entity.centerY - this.centerY,2));
        }

        this.draw = function()
        {
            let p = activeCamera.translateCoord(this.x, this.y);
            let s = activeCamera.scaleSize(this.width, this.height);
            ctx.fillRect(p[0], p[1], s[0], s[1]);   
        }
    }

    get centerX()
    {
        return this.x + this.width / 2;
    }
    
    get centerY()
    {
        return this.y + this.height / 2;
    }
}

class FancyEntity extends Entity
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height);
        this.velocityX = 0;
        this.velocityY = 0;
    }
}

class ImageEntity extends FancyEntity
{
    constructor(x, y, width, height, image)
    {
        super(x, y, width, height);
        this.image = image;

        this.isTalking = false;
        this.talkMessage = "";

        this.draw = function()
        {
            let p = activeCamera.translateCoord(this.x, this.y);
            let s = activeCamera.scaleSize(this.width, this.height);
            ctx.drawImage(this.image, 0,0, this.image.width, this.image.height, p[0], p[1], s[0], s[1]);

            if(this.isTalking)
            {
                //let textSize = ctx.measureText(this.talkMessage);
                //let textPos = activeCamera.translateCoord(this.x + textSize.width / 2, 0);
                ctx.fillText(this.talkMessage, p[0], p[1] - 30);
            }
        }

        this.say = function(text, duration = 3000)
        {
            this.isTalking = true;
            this.talkMessage = text;
            setTimeout(stopTalking, duration);
        }

        this.stopTalking = function()
        {
            this.isTalking = false;
            this.talkMessage = "";
        }

    }
}

function stopTalking(entity)
{
    entity.isTalking = false;
}

function clamp(number, min, max)
{
    return Math.min(Math.max(number, min), max);
}

function onKeyDown(event)
{
    let key = event.key
    if(key == "ArrowUp"){
        player.velocityY = -5;
    }
    else if(key == "ArrowDown"){
        player.velocityY = 5;
    }
    else if(key == "ArrowLeft"){
        player.velocityX = -5;
    }
    else if(key == "ArrowRight"){
        player.velocityX = 5;
    }
    else if(key == "e")
    {
        enemy.say("Hello there!");
    }
}

function onKeyUp(event)
{
    let key = event.key
    if(key == "ArrowUp"){
        player.velocityY = 0;
    }
    else if(key == "ArrowDown"){
        player.velocityY = 0;
    }
    else if(key == "ArrowLeft"){
        player.velocityX = 0;
    }
    else if(key == "ArrowRight"){
        player.velocityX = 0;
    }
}

function updateMousePos(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseDown(event)
{
    lmbDown = true;
}

function onMouseUp(event)
{
    lmbDown = false;
}

function smoothCameraOnEntity(entity, smoothness)
{
    activeCamera.x += ((entity.centerX- gameCanvas.width / 2) - activeCamera.x) / smoothness;
    activeCamera.y += ((entity.centerY- gameCanvas.height / 2) - activeCamera.y) / smoothness;
}

function transformDrawRect(x, y, width, height)
{
    let p = activeCamera.translateCoord(x, y);
    let s = activeCamera.scaleSize(width, height);
    ctx.fillRect(p[0], p[1], s[0], s[1]);
}

function drawEntity(entity)
{
    transformDrawRect(entity.x, entity.y, entity.width, entity.height);
}

window.main = (time) => {
    window.requestAnimationFrame(main);
    
    if (!lastTime) { lastTime = time; }
    var elapsed = time - lastTime;
    
    if(elapsed > requiredElapsed)
    {
        gameTick();
        lastTime = time;
    }

    player.x += player.velocityX;
    player.y += player.velocityY;

    if(player.distanceToEntity(enemy) < 250)
    {
        smoothCameraOnEntity(enemy, 20);
        activeCamera.zoom += (1.5 - activeCamera.zoom) / 20;
    }
    else{
        smoothCameraOnEntity(player, 10);
        activeCamera.zoom += (1 - activeCamera.zoom) / 20;
    }
    
    ctx.clearRect(0,0, gameCanvas.width, gameCanvas.height)
    ctx.fillStyle = "#ffffff";
    
    player.draw()
    enemy.draw();
}

// Gets called every gametick
function gameTick()
{
    //smoothCameraOnEntity(pl, 20);
}

function init()
{
    activeCamera = mainCamera;
    ctx.font =  "30px sans-serif";
}

const gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;
var lastTime = 0;
var requiredElapsed = 1000 / 10; // 10 tps

var mouseX = 0;
var mouseY = 0;
var lmbDown = false;
document.addEventListener("mousemove", updateMousePos);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

var activeCamera;
var mainCamera = new Camera(-gameCanvas.width / 2,-gameCanvas.height / 2,1);

var img = new Image(64, 64);
img.src = "https://images.placeholders.dev/?width=64&height=64";

var player = new ImageEntity(0,0,50,50, img);
var enemy = new ImageEntity(100, 100, 125, 125, img);

init();
window.requestAnimationFrame(main);