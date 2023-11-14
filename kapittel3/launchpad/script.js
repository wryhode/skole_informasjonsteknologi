function setClicked(event)
{
    const element = event.srcElement;
    element.style.opacity = "50%";
}

function setUnclicked(event)
{
    const element = event.srcElement;
    element.style.opacity = "100%";
}

window.onload = function() {
    const buttonGrids = document.getElementsByClassName("buttonGrid");

    for (let bG = 0; bG < buttonGrids.length; bG ++)
    {
        const element = buttonGrids[bG];
        const size = element.getAttribute("rows") * element.getAttribute("cols");
        let num = 0;
        for (let i = 0; i < 360; i=i+(360/size))
        {
            const el = document.createElement("img");
            el.src = "./button.png";
            el.style.cssText += `filter: hue-rotate(${i}deg);`;
            el.className = "button";

            el.addEventListener("mousedown",setClicked);
            el.addEventListener("mouseup",setUnclicked);


            element.appendChild(el);
            num ++;
            if (num % element.getAttribute("rows") == 0)
            {
                element.appendChild(document.createElement("br"));
            }
        }
    }
}