const startAnimation = (entries, observer) => {
    entries.forEach(entry => {
      entry.target.classList.toggle("slide-in-from-right", entry.isIntersecting);
    });
  };
  
  const observer = new IntersectionObserver(startAnimation);
  const options = { root: null, rootMargin: '0px', threshold: 1 }; 
  
  const elements = document.querySelectorAll('.card');
  elements.forEach(el => {
    observer.observe(el, options);
  });

function addKeepColor(event)
{
    event.srcElement.classList.add("keepColor");
}

const apikey="563492ad6f917000010000019b983f3b62fe43daa92e746d4553dd35";

async function CuratedPhotos(page_num)
{
    var numImages = document.getElementsByClassName('fancySelectElement').length + document.getElementsByClassName('placeholderImage').length;
    console.log(numImages);
    document.title = document.getElementById("ttl").innerHTML;
    var data=await fetch(`https://api.pexels.com/v1/search?query=${document.getElementById("ttl").innerHTML}&orientation=landscape&page=1&per_page=${numImages}`, 
    {
        method: "GET",
        headers:
        {
            Accept: "application/json",
            Authorization: apikey,
        },
    });
    var response=await data.json();
    var n_pages = Math.floor(response.total_results / numImages);

    var data=await fetch(`https://api.pexels.com/v1/search?query=${document.getElementById("ttl").innerHTML}&orientation=landscape&page=${Math.floor(Math.random()*n_pages)}&per_page=${numImages}`, 
    {
        method: "GET",
        headers:
        {
            Accept: "application/json",
            Authorization: apikey,
        },
    });
    var response=await data.json();
    display_images(response);
}

function display_images(response)
{
    var i = 0;
    response.photos.forEach((image) => 
    {
        var el = document.getElementsByClassName("fancySelectElement").item(i);
        if (el != null)
        {
            el.style.backgroundImage = `url(${image.src.large})`;
            el.style.backgroundColor = image.avg_color;
            el.setAttribute("onclick",`window.open('${image.url}');`);
            el.addEventListener("mouseover",addKeepColor)
            el.getElementsByTagName("a")[0].href = image.url;
            el.getElementsByTagName("a")[0].innerHTML = image.photographer_url;
            el.getElementsByTagName("p")[0].innerHTML = image.alt + " by " + String(image.photographer) + ".";
        }
        else
        {
            var el = document.getElementsByClassName("placeholderImage").item(i-document.getElementsByClassName('fancySelectElement').length);
            if (el != null)
            {
                el.src = image.src.large;
            }
        }
        i++;
    });
}

function populateLorem()
{
    var el = document.getElementsByClassName("lorem");
    for (const element in el) 
    {
        ele = el.item(element);
        const response = "Jowl prosciutto salami, beef ribs pig kielbasa turducken leberkas.  Alcatra kielbasa bresaola, hamburger chuck buffalo ball tip beef biltong spare ribs frankfurter.  Sirloin ground round short loin, filet mignon ham frankfurter swine beef ribs shoulder picanha turducken.  Pastrami chuck chislic beef drumstick.  Jowl boudin corned beef swine, meatloaf chuck shank kevin salami leberkas filet mignon bacon chicken pastrami.";
        ele.innerHTML = response;
    };
}

function fadeProxElements(event)
{
    const el = document.getElementsByClassName("proximityOpacity");
    for (const i in el)
    {
        element = el.item(i);
        const rect = ele.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height
        const top = rect.top + document.body.scrollTop;
        const left = rect.left + document.body.scrollLeft;
        const x = left + (w/2);
        const y = top + (h/2);  

        var a = event.pageX - x;
        var b = event.pageY - y;

        var distance = Math.sqrt( a*a + b*b );

        element.style.opacity= `${distance/1000}%`;
    }
}

function onLoaded()
{
    CuratedPhotos();
    populateLorem();
    document.addEventListener("mousemove",fadeProxElements);
    document.getElementById("container").style.display = "contents";
}

window.onload = onLoaded();