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
    var numImages = document.getElementsByClassName('fancySelectElement').length;
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
    console.log(response.total_results);
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
    console.log(response);
    display_images(response);
}

function display_images(response)
{
    var i = 0;
    response.photos.forEach((image) => 
    {
        var el = document.getElementsByClassName("fancySelectElement").item(i)
        if (el != null)
        {
            el.style.backgroundImage = `url(${image.src.large})`;
            el.style.backgroundColor = image.avg_color;
            el.setAttribute("onclick",`window.open('${image.url}');`);
            el.addEventListener("mouseover",addKeepColor)
            console.log(image.photographer);
            el.getElementsByTagName("a")[0].href = image.url;
            el.getElementsByTagName("a")[0].innerHTML = image.photographer_url;
            el.getElementsByTagName("p")[0].innerHTML = image.alt + " by " + String(image.photographer) + ".";
        }
        i++;
    });
}

function onLoaded()
{
    CuratedPhotos();
    document.getElementById("container").style.display = "contents";
}

window.onload = onLoaded();