let terminal = document.getElementById("terminal");
let terminalIn = document.getElementById("termInput");
let terminalButton = document.getElementById("termReturn")
let lastInput = "";

function termText(text)
{
    terminal.innerHTML += text;
}

function termLine(text)
{
    termText(text + "<br>");
}

function doTheThing()
{
    termLine("---- Rektangel (Oppgave 1)");

    let height = Number(prompt("Hva er høyden?")); // Definerer høyde
    let width = Number(prompt("Hva er bredden?")); // Definerer bredde

    termLine("Arealet er " + (height * width) + "cm²"); // Regner ut arealet og skriver det ut
    termLine("Omkretsen er " + (2 * (height + width)) + "cm"); // Regner ut omkretsen og skriver ut resultatet

    termLine("");
    termLine("---- Tilfeldige tall (Oppgave 2)");

    let randomNumber1_6 = Math.floor((Math.random() * 6)+ 1);
    let randomNumber0_10 = Math.floor(Math.random() * 10);
    let randomNumber10_20 = Math.floor(Math.random() * 10) + 10;

    termLine("1 - 6 > " + String(randomNumber1_6));
    termLine("0 - 10 > " + String(randomNumber0_10));
    termLine("10 - 20 > " + String(randomNumber10_20));

    termLine("");
    termLine("---- Kuler (Oppgave 3)");

    let radius = Number(prompt("Hva er radien til kula?"));

    let omkrets = 2 * Math.PI * radius;
    let volum = 4 * Math.PI * Math.pow(radius, 3);
    let areal = 4 * Math.PI * Math.pow(radius, 2);

    termLine("Omkretsen er " + omkrets.toFixed(2));
    termLine("Volumet er " + volum.toFixed(2));
    termLine("Omkretsen er " + areal.toFixed(2));


    termLine("");
    termLine("---- Karakterskala (Oppgave 4)");

    let besvartPoeng = Number(prompt("Hvor mange poeng var besvarelsen?"));
    let maksPoeng = Number(prompt("Hvor mange poeng var besvarelsen?"));
    let karakter = (besvartPoeng / maksPoeng) * 6;

    termLine("Karakteren blir " + Math.floor(karakter));

    termLine("");
    termLine("---- KMI (Oppgave 5)");

    let vekt = Number(prompt("Hva veier du?"));
    let hoyde = Number(prompt("Hvor høy er du?"));
    let kmi = (vekt / Math.pow(hoyde, 2));

    termLine("KMI-en din er " + kmi);
}

terminalButton.onclick = function(){
    alert(terminalIn.value);
}
