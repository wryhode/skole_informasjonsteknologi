function fixedMod(n, m)
{
    return ((n % m) + m) % m;
}

function encrypt(message, shift)
{
    let encrypted = [];

    for(let i = 0; i < message.length; i++)
    {
        if (message[i] == " ")
        {
            encrypted.push(" ");
        }
        else
        {
            let charCode = Number(message.charCodeAt(i)) - 97;
            let encryptedCharCode = fixedMod(charCode + shift, 26);
            encrypted.push(String.fromCharCode(encryptedCharCode + 97));
        }
    }

    return encrypted.join("")
}

function decrypt(message, shift)
{
    let decrypted = [];

    for(let i = 0; i < message.length; i++)
    {
        let decryptedCharCode = (message.charCodeAt(i) - shift);
        console.log(decryptedCharCode);
        if (decryptedCharCode == 32 - shift)
        {
            decrypted.push(" ");   
        }
        else
        {
            decrypted.push(String.fromCharCode(decryptedCharCode));
        }
    }

    return decrypted.join("")
}

function doEncrypt(event)
{
    encryptOutput.innerHTML = encrypt(encInputField.value, Number(encShiftValue.value));
}

function doDecrypt(event)
{
    decryptOutput.innerHTML = decrypt(decInputField.value, Number(decShiftValue.value));
}

const encInputField = document.getElementById("toEncrypt");
const encShiftValue = document.getElementById("encShiftValue");
const encryptButton = document.getElementById("toEncryptSubmit");
const encryptOutput = document.getElementById("encOutput")

const decInputField = document.getElementById("toDecrypt");
const decShiftValue = document.getElementById("decShiftValue");
const decryptButton = document.getElementById("toDecryptSubmit");
const decryptOutput = document.getElementById("decOutput")

encryptButton.addEventListener("click", doEncrypt);
decryptButton.addEventListener("click", doDecrypt);