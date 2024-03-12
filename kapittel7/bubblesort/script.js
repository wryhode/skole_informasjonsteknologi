const elOutput = document.getElementById("output");

let numbers = [];

function generateRandomNumbers(n)
{
    numbers = [];
    for(let i = 0; i < n; i++)
    {
        numbers.push(Math.floor(Math.random()*100));
    }
}

function bubbleSort(arr)
{
    let timeStart = Date.now();

    let nSwaps = 0;

    let swapped = true;
    while(swapped == true)
    {

        let time = Date.now()

        if(time - timeStart > 100000) // Sets a "timeout" in case I mess up
        {
            return {"result":"error", "error":"timeout"};
        }

        swapped = false
        for(let n = 0; n < arr.length; n++)
        {
            let value0 = arr[n];
            let value1 = arr[n + 1];

            if(value0 > value1)
            {
                arr[n] = value1;
                arr[n + 1] = value0;
                nSwaps ++;
                swapped = true;
            }
        }
    }
    
    let duration = Date.now() - timeStart;
    return {"result":"success", "output":arr, "duration":duration, "swaps":nSwaps};
}

function displayOutput(toDisplay)
{
    elOutput.innerHTML += toDisplay + "<br>";
}

generateRandomNumbers(1000);

displayOutput("Input:")
displayOutput(numbers);

let sorted = bubbleSort(numbers);

if(sorted.result != "success")
{
    displayOutput(`Error: ${sorted.error}`)
}
else
{
    displayOutput("Sorted:")
    displayOutput(sorted.output);
    
    displayOutput(`Took ${sorted.duration} ms`);
    displayOutput(`Swapped ${sorted.swaps} values`);
}