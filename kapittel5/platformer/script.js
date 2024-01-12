// first init
const gameDiv = document.getElementById("gameCanvas");
let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
gameDiv.appendChild(canvas)

let mouseX = 0;
let mouseY = 0;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let cameraFollowPlayer = false;

function handleMouseMove(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function handleKeyDown(event)
{
    if(event.key == "ArrowUp" || event.key == "z")
    {
        upPressed = true;
    }
    else if(event.key == "ArrowLeft")
    {
        leftPressed = true;
    }
    else if(event.key == "ArrowRight")
    {
        rightPressed = true;
    }
    else if(event.key == "f")
    {
        cameraFollowPlayer = !cameraFollowPlayer;
    }
}

function handleKeyUp(event)
{
    if(event.key == "ArrowUp" || event.key == "z")
    {
        upPressed = false;
    }
    else if(event.key == "ArrowLeft")
    {
        leftPressed = false;
    }
    else if(event.key == "ArrowRight")
    {
        rightPressed = false;
    }
}

document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function drawRect(rect)
{
    let coord = camera.translateCoord(rect.x, rect.y);
    let size = camera.scaleCoord(rect.width, rect.height);
    ctx.fillRect(coord[0], coord[1], size[0], size[1]);
}

class World
{
    constructor()
    {
        this.gravityX = 0;
        this.gravityY = 0.5;
    }
}

class Camera
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.targetFollowX = 0;
        this.targetFollowY = 0;
        this.followSmooth = 10;
        this.targetZoom = 1;
        this.zoom = 1;

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
        this.collideRect = function(rect)
        {
            return this.x + this.width > rect.x && this.x < rect.x + rect.width && this.y + this.height > rect.y && this.y < rect.y + rect.height;
        }
        
        this.rectOnEdge = function(rect)
        {
            if(rect.y > this.y)
            {
                this.distY = rect.y - (this.y + this.height);
            }
            else
            {
                this.distY = (rect.y + rect.height) - this.y;
            }
            if(rect.x > this.x)
            {
                this.distX = rect.x - (this.x + this.width);
            }
            else
            {
                this.distX = (rect.x + rect.width) - this.x;
            }
            if(this.distX == 0 && rect.y + rect.height > this.y && rect.y < this.y + this.height)
            {
                return true;
            }   
            if(this.distY == 0 && rect.x + rect.width > this.x && rect.x < this.x + this.width)
            {
                return true;
            }
        }
    }
}

class Player extends Rect
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height);
        this.velocityX = 0;
        this.velocityY = 0;
        this.canJump = true;
    }
}

class Platform extends Rect
{
    constructor(x, y, width, height)
    {
        super(x, y, width, height);
    }
}

// step function
window.main = () => {
    window.requestAnimationFrame(main);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.velocityY += world.gravityY;
    
    level.forEach(ground => {
        if(player.collideRect(ground))
        {
            // Figure out which direction to push the player
            pushDirY = 0;
            pushDirX = 0;
            player.y ++;
            if(player.collideRect(ground))
            {
                player.velocityY = 0;
                if(player.y <= ground.y + (ground.height / 2))
                {
                    pushDirY = -1;
                    player.canJump = true;
                }
                else
                {
                    pushDirY = 1;
                }
            }
            else
            {
                player.velocityX = 0;
                if(player.x <= ground.x + (ground.width / 2))
                {
                    pushDirX = 1;
                }
                else
                {
                    pushDirX = -1;
                }
            }

            while(player.collideRect(ground))
            {
                player.x += pushDirX;
                player.y += pushDirY;
            }
            //player.x -= pushDirX;
            //player.y -= pushDirY;
        }

        if(upPressed && player.canJump)
        {
            player.velocityY = -10;
            player.y --;
            player.canJump = false;
        }
    });

    if(leftPressed)
    {
        player.velocityX = -5;
    }
    else if(rightPressed)
    {
        player.velocityX = 5;
    }
    else
    {
        player.velocityX = 0;
    }

    player.x += player.velocityX;
    player.y += player.velocityY;

    if(cameraFollowPlayer)
    {
        camera.targetFollowX = player.x;
        camera.targetFollowY = player.y;
        camera.targetZoom = 1;
        camera.followSmooth = 10;
    }
    else
    {
        camera.targetFollowX = 0;
        camera.targetFollowY = 0;
        camera.targetZoom = 0.5;
        camera.followSmooth = 5;
    }
    camera.smoothFollow();

    ctx.fillStyle = "#ffffff";
    drawRect(player);
    level.forEach(platform => {
        drawRect(platform);
    });
};

let world = new World();
let camera = new Camera(0,0);
let player = new Player(0, 0, 32, 32);
let level = [];
level.push(new Platform(-500, 600, 1000, 30));
level.push(new Platform(-100, 500, 200, 30));
level.push(new Platform(400, 500, 130, 130));

main();