const ELresult = document.getElementById("result");
const ELnumberA = document.getElementById("numberA");
const ELnumberB = document.getElementById("numberB");
const ELsubmitButton = document.getElementById("submitButton");

function multiply(a, b)
{
    return a * b;
}

ELsubmitButton.onclick = function()
{
    ELresult.innerHTML = "";
    let valueA = ELnumberA.value;
    let valueB = ELnumberB.value;
    for(let i = 0; i - 1 < valueA; i++)
    {
        let result = multiply(i, valueB);
        ELresult.innerHTML += i.toString() + " * " + valueB.toString() + " = " + result.toString() + "<br>";
    }
} 