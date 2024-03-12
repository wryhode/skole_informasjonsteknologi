const elOutput = document.getElementById("output");

function fibonacci(n)
{
    let a_n = (n-1) + (n-2);

    elOutput.innerHTML += a_n + "<br>";

}

fibonacci(2);
