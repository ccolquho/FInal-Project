const fetch_words_hints = "data/words.json";
let gameImg = document.getElementById("gameImg");
let checkBtn = document.getElementById("checkInput");
let input = document.getElementById("letterInput");
let gameState = document.getElementById("status");

const game = {
    word: "",
    hint: "",
    wordAnswer: [],
    maxGuesses: 6,
    wrongGuesses: 0,
}

fetch(fetch_words_hints)
    .then(function(response){
        if(response.ok){
            console.log("JSON succesfully connected");
            return response.json();
            
        }
        else{
            console.log("Network error: fetch failed");
        }})  
    .then(data => {
            wordsData = data;
            initGame(); 
        })

function pickWord() {
    const randomIndex = Math.floor(Math.random() * wordsData.length);
        game.word = wordsData[randomIndex].word.toLowerCase();
        game.hint = wordsData[randomIndex].hint;

        document.getElementById("hint").textContent = `Hint: ${game.hint}`;

        game.wordAnswer = Array(game.word.length).fill("_")
        updateWordAnswer();

    const usedLetters = lettersWrap.querySelectorAll("p");
    usedLetters.forEach(stateChange => {
        stateChange.className = "unselected";
    })
};

function updateWordAnswer() {
    document.getElementById("wordDisplay").textContent = game.wordAnswer.join(" ");
}

function gameOver() {
    checkBtn = document.getElementById("checkInput")

    checkBtn.textContent = "Play Again"

    const newGameBtn = checkBtn.cloneNode(true);
    checkBtn.parentNode.replaceChild(newGameBtn, checkBtn);
    checkBtn = newGameBtn;

    checkBtn.addEventListener("click", () => {
        initGame();
        
    })

}


function initGame() {
    game.wrongGuesses = 0;
    game.guessesLeft = game.maxGuesses;
    
    gameState.textContent = `Guess Carefully, you only get 6!`
    gameImg.src = './images/chinchilla-start.png';
    gameImg.alt = 'chichilla-start';
    
    const oldBtn = document.getElementById("checkInput");
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    checkBtn = newBtn;

    checkBtn.textContent = "Guess!";
    checkBtn.disabled = false;
    input.disabled = false;
    input.value = "";
    
    pickWord();
    startGame()
}

function startGame() {
    checkBtn.addEventListener("click", () => {
        const letter = input.value.toLowerCase();
        input.value = ""
        input.disabled = false;
        
        updateWordAnswer();

        if (!letter.match(/^[a-z]$/)) return;

        const letterGuess = document.getElementById(letter);
        if (letterGuess.className === "selectedCorrect" || letterGuess.className === "selectedWrong") return;

        // correct guess
        if (game.word.includes(letter.toLowerCase())) {
            fadeLetter(letterGuess, "selectedCorrect");

            for (let i = 0; i < game.word.length; i++){
                if (game.word[i] === letter) {
                    game.wordAnswer[i] = letter.toUpperCase();
                }
            }
            updateWordAnswer();
        
        // win condition
        if(!game.wordAnswer.includes("_")) {
            gameState.textContent = `Winner Winner Chinchilla Got His Dinner!`;
            gameImg.src = './images/chinchilla-win.png';
            gameImg.alt = 'chichilla-win';
            input.disabled = true;
            gameOver();
            }
        } 
        
        // incorrect guess
        else {
            fadeLetter(letterGuess, "selectedWrong");
            game.wrongGuesses++;
            
            let guessesLeft = game.maxGuesses - game.wrongGuesses
            

            if (guessesLeft === 5) {
                gameState.textContent = `You have ${guessesLeft} guesses left. He's getting hungrier!`
                gameImg.src = './images/chinchilla-1.png';
                gameImg.alt = 'chichilla-1';
            }

            else if (guessesLeft === 4) {
                gameState.textContent = `You have ${guessesLeft} guesses left. He's getting hungrier!`
                gameImg.src = './images/chinchilla-2.png';
                gameImg.alt = 'chichilla-2';
            }
            
            else if (guessesLeft === 3) {
                gameState.textContent = `You have ${guessesLeft} guesses left. He's not stopping!`
                gameImg.src = './images/chinchilla-3.png';
                gameImg.alt = 'chichilla-3';
            }

            else if (guessesLeft === 2) {
                gameState.textContent = `You have ${guessesLeft} guesses left. He's getting close to the edge!`
                gameImg.src = './images/chinchilla-4.png';
                gameImg.alt = 'chichilla-4';
            }

            else if (guessesLeft === 1) {
                gameState.textContent = `You have ${guessesLeft} guess left... Make this one count!`
                gameImg.src = './images/chinchilla-5.png';
                gameImg.alt = 'chichilla-5';
            }
            
            // lose condition
            if (game.wrongGuesses >= game.maxGuesses) {
                gameState.textContent = `Game Over Chinchilla! The password was "${game.word.toUpperCase()}"`
                gameImg.src = './images/chinchilla-lose.png';
                gameImg.alt = 'chichilla-lose';
                input.disabled = true;
                gameOver();
            }
        }
        }
    )
    
function fadeLetter(letterElement, updateClass) {
    letterElement.className = "unselected"

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            letterElement.className = updateClass;
        })
    })
}
   

};