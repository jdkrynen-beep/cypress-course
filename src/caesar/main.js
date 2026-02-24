let cypherKey = 1
let message = "A"

function caesar(message, cypherKey=1) {
    let cypheredMessage = "";

    for (let i = 0; i < message.length; i++) {
        let char = message[i];

        if (char >= 'A' && char <= 'Z') {
            let charCode = char.charCodeAt(0);
            let newCharCode = (charCode - 65 + cypherKey) % 26 + 65;
            cypheredMessage += String.fromCharCode(newCharCode);
        } else if (char >= 'a' && char <= 'z') {
            let charCode = char.charCodeAt(0);
            let newCharCode = (charCode - 97 + cypherKey) % 26 + 97;
            cypheredMessage += String.fromCharCode(newCharCode);
        } else {
            cypheredMessage += char;
        }
    }

    return cypheredMessage;
}

// Connecter le bouton au formulaire HTML
const button = document.querySelector("button");
const input = document.querySelector("#cypher-key");
const textarea = document.querySelector("textarea");
const resultParagraph = document.querySelector("#result");

button.addEventListener("click", function() {
    let key = parseInt(input.value) || 1;
    
    // Validation: clé entre 1 et 25
    if (key < 1 || key > 25) {
        resultParagraph.textContent = "Erreur: La clé doit être entre 1 et 25";
        resultParagraph.style.color = "#ff4444";
        return;
    }
    
    resultParagraph.style.color = "#00d4ff";
    const text = textarea.value;
    const encrypted = caesar(text, key);
    resultParagraph.textContent = encrypted;
});

console.log(caesar(message))