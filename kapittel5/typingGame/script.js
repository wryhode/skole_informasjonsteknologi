const mainDiv = document.getElementById("game");
let canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
let currentTypeGoal = [];
let currentTypeIndex = 0;
// To any future employers that are about to look at this im so sorry in advance. In my defense this wasn't my idea
//let storyText = "I like to creep around my home and act like a goblin I don’t know why but I just enjoy doing this. Maybe it’s my way of dealing with stress or something but I just do it about once every week. Generally I’ll carry around a sack and creep around in a sort of crouch-walking position making goblin noises, then I’ll walk around my house and pick up various different “trinkets” and put them in my bag while saying stuff like “I’ll be having that” and laughing maniacally in my goblin voice (“trinkets” can include anything from shit I find on the ground to cutlery or other utensils). The other day I was talking with my neighbours and they mentioned hearing weird noises like what I wrote about and I was just internally screaming the entire conversation. I’m 99% sure they don’t know it’s me but god that 1% chance is seriously weighing on my mind."
let storyText = "Hey guys, did you know that in terms of male human and female Pokémon breeding, Vaporeon is the most compatible Pokémon for humans? Not only are they in the field egg group, which is mostly comprised of mammals, Vaporeon are an average of 3”03’ tall and 63.9 pounds, this means they’re large enough to be able handle human dicks, and with their impressive Base Stats for HP and access to Acid Armor, you can be rough with one. Due to their mostly water based biology, there’s no doubt in my mind that an aroused Vaporeon would be incredibly wet, so wet that you could easily have sex with one for hours without getting sore. They can also learn the moves Attract, Baby-Doll Eyes, Captivate, Charm, and Tail Whip, along with not having fur to hide nipples, so it’d be incredibly easy for one to get you in the mood. With their abilities Water Absorb and Hydration, they can easily recover from fatigue with enough water. No other Pokémon comes close to this level of compatibility. Also, fun fact, if you pull out enough, you can make your Vaporeon turn white. Vaporeon is literally built for human dick. Ungodly defense stat+high HP pool+Acid Armor means it can take cock all day, all shapes and sizes and still come for more".toLowerCase();
let story = storyText.replaceAll("é","e").replaceAll(",","").replaceAll(".","").replaceAll("?","").replaceAll('”',"").replaceAll("’","").split(" ");
let storyIndex = 0;
let alphabet = 'abcdefghijklmnopqrstuvwxyz';
let numbers = '0123456789';
let specials = "+-*/";
let mouseX, mouseY = 0;

function handleMouseMove(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;
}

document.addEventListener("mousemove", handleMouseMove);

function handleKeyDown(event)
{
    let key = event.key;
    if(alphabet.includes(key) || numbers.includes(key) || specials.includes(key)){

        if(key == currentTypeGoal[currentTypeIndex])
        {
            currentTypeIndex ++;
            if(currentTypeIndex >= currentTypeGoal.length)
            {
                winCurrentType();
            }
        }
        else
        {
            onTypo();
        }
    }
}

document.addEventListener("keydown", handleKeyDown);

function winCurrentType()
{
    //generateNextLetters();
    generateRandomLetters(100+Math.floor(Math.random()*5));
    currentTypeIndex = 0;
}

function onTypo()
{
    let sound = new Audio("./wrong.mp3");
    sound.loop = false;
    sound.play();
    generateNextLetters();
    currentTypeIndex = 0;
}

function generateRandomLetters(nChars)
{
    currentTypeGoal = [];
    for (let i = 0; i < nChars; i++) {
        currentTypeGoal.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
}

function generateNextLetters(index)
{
    currentTypeGoal = [];
    for (let i = 0; i < story[storyIndex].length; i++)
    {
        currentTypeGoal.push(story[storyIndex][i]);
    }
    storyIndex ++;
}

function randomRGB()
{
    return `rgba(${64+Math.floor(Math.random()*128)}, ${64+Math.floor(Math.random()*128)}, ${64+Math.floor(Math.random()*128)}, 1.0);`
}

function hsvToRgb(h, s, v) {
    var r, g, b;
  
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
  
    return [ r * 255, g * 255, b * 255 ];
}

function rgbToRgbaString(color)
{
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1.0)`
}

window.main = () =>
{
    window.requestAnimationFrame(main);
    
    ctx.fillStyle = rgbToRgbaString(hsvToRgb((timer/1000) % 1, 0.75, 0.75));
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#00ff00";
    ctx.font = "100px Arial";
    let xi = (canvas.width / 2) / (currentTypeGoal.length-1);
    let x = canvas.width / 4;
    let i = 0;
    currentTypeGoal.forEach(letter => {
        if(i == currentTypeIndex)
        {
            ctx.fillStyle = "#0000ff";
        }
        else if(i > currentTypeIndex)
        {
            ctx.fillStyle = "#000000";
        }
        ctx.fillText(letter, x, canvas.height / 2);
        ctx.fillStyle = rgbToRgbaString(hsvToRgb(((timer/1000) + 0.5)% 1, 1, 1));
        ctx.strokeText(letter, x, canvas.height / 2);
        x += xi;
        i ++;
    });
    
    ctx.stroke();
    timer ++;
}
generateRandomLetters(3);

setInterval(generateRandomLetters,100,10);

let timer = 0;
main();