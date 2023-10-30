const apikey="563492ad6f917000010000019b983f3b62fe43daa92e746d4553dd35";

async function CuratedPhotos(page_num)
{
    var data=await fetch(`https://api.pexels.com/v1/search?query=${document.getElementById("ttl").innerHTML}&orientation=landscape&page=1&per_page=3`, 
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
    var n_pages = Math.floor(response.total_results / 3);

    var data=await fetch(`https://api.pexels.com/v1/search?query=${document.getElementById("ttl").innerHTML}&orientation=landscape&page=${Math.floor(Math.random()*n_pages)}&per_page=3`, 
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