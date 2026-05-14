// ======================================================
// ELEMENTOS
// ======================================================

const turnTitle = document.getElementById("turnTitle");
const statusMessage = document.getElementById("statusMessage");

const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");

const hintText = document.getElementById("hintText");

const startGameBtn = document.getElementById("startGameBtn");
const restartBtn = document.getElementById("restartBtn");

const currentPlayerText = document.getElementById("currentPlayerText");
const difficultyText = document.getElementById("difficultyText");

const player1AttemptsText =
    document.getElementById("player1Attempts");

const player2AttemptsText =
    document.getElementById("player2Attempts");

const bestScoreText =
    document.getElementById("bestScoreText");

const phaseText =
    document.getElementById("phaseText");

const victoryScreen =
    document.getElementById("victoryScreen");

const victoryText =
    document.getElementById("victoryText");

const difficultyButtons =
    document.querySelectorAll(".difficulty-btn");


// ======================================================
// ESTADO DO JOGO
// ======================================================

let gameStarted = false;

let currentPlayer = 1;

let difficulty = "easy";

let secretNumber = 0;

let currentAttempts = 0;

let player1Attempts = null;
let player2Attempts = null;


// ======================================================
// RECORD
// ======================================================

loadBestScore();

function saveBestScore(value){

    const currentBest =
        localStorage.getItem("guess_best");

    if(
        !currentBest ||
        value < Number(currentBest)
    ){

        localStorage.setItem(
            "guess_best",
            value
        );

    }

    loadBestScore();

}


function loadBestScore(){

    const best =
        localStorage.getItem("guess_best");

    if(best){

        bestScoreText.textContent =
            `${best} tentativas`;

        return;

    }

    bestScoreText.textContent =
        "Sem recorde";

}


// ======================================================
// EVENTOS
// ======================================================

difficultyButtons.forEach(button => {

    button.addEventListener("click", () => {

        if(gameStarted) return;

        difficultyButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        difficulty =
            button.dataset.level;

        updateDifficultyText();

    });

});


startGameBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    restartGame
);


guessBtn.addEventListener(
    "click",
    checkGuess
);


// ======================================================
// INICIAR
// ======================================================

function startGame(){

    gameStarted = true;

    currentPlayer = 1;

    player1Attempts = null;
    player2Attempts = null;

    player1AttemptsText.textContent = "-";
    player2AttemptsText.textContent = "-";

    victoryScreen.style.display = "none";

    startPlayerTurn();

}


// ======================================================
// JOGADOR
// ======================================================

function startPlayerTurn(){

    currentAttempts = 0;

    secretNumber =
        generateNumber();

    guessInput.disabled = false;

    guessInput.value = "";

    guessInput.focus();

    turnTitle.textContent =
        `Jogador ${currentPlayer}`;

    hintText.textContent =
        "Faça seu primeiro palpite.";

    phaseText.textContent =
        "Rodada em andamento";

    updateSideInfo();

}


// ======================================================
// NÚMERO ALEATÓRIO
// ======================================================

function generateNumber(){

    let max = 50;

    if(difficulty === "medium"){
        max = 100;
    }

    if(difficulty === "hard"){
        max = 500;
    }

    return Math.floor(
        Math.random() * max
    ) + 1;

}


// ======================================================
// PALPITE
// ======================================================

function checkGuess(){

    if(!gameStarted) return;

    const guess =
        Number(guessInput.value);

    if(!guess){

        hintText.textContent =
            "Digite um número.";

        return;

    }

    currentAttempts++;

    if(guess < secretNumber){

        hintText.textContent =
            "⬆️ O número é maior";

        return;

    }

    if(guess > secretNumber){

        hintText.textContent =
            "⬇️ O número é menor";

        return;

    }

    playerCorrect();

}


// ======================================================
// ACERTO
// ======================================================

function playerCorrect(){

    guessInput.disabled = true;

    hintText.textContent =
        "🎉 Você acertou!";

    showVictoryScreen();

    saveBestScore(
        currentAttempts
    );

    if(currentPlayer === 1){

        player1Attempts =
            currentAttempts;

        player1AttemptsText.textContent =
            currentAttempts;

        currentPlayer = 2;

        setTimeout(() => {

            turnTitle.textContent =
                "Passe para Jogador 2";

        }, 1000);

        setTimeout(() => {

            startPlayerTurn();

        }, 2500);

        return;

    }

    player2Attempts =
        currentAttempts;

    player2AttemptsText.textContent =
        currentAttempts;

    finishChampionship();

}


// ======================================================
// VITÓRIA
// ======================================================

function showVictoryScreen(){

    victoryScreen.style.display =
        "block";

    victoryText.textContent =
        `Acertou em ${currentAttempts} tentativas`;

    setTimeout(() => {

        victoryScreen.style.display =
            "none";

    }, 2000);

}


// ======================================================
// FINAL
// ======================================================

function finishChampionship(){

    gameStarted = false;

    let result = "";

    if(
        player1Attempts <
        player2Attempts
    ){

        result =
            "🏆 Jogador 1 venceu!";

    }

    else if(
        player2Attempts <
        player1Attempts
    ){

        result =
            "🏆 Jogador 2 venceu!";

    }

    else{

        result =
            "🤝 Empate!";

    }

    turnTitle.textContent =
        "Campeonato encerrado";

    phaseText.textContent =
        result;

}


// ======================================================
// REINICIAR
// ======================================================

function restartGame(){

    gameStarted = false;

    currentPlayer = 1;

    player1Attempts = null;
    player2Attempts = null;

    currentAttempts = 0;

    guessInput.disabled = false;

    guessInput.value = "";

    turnTitle.textContent =
        "Aguardando início...";

    hintText.textContent =
        "Nenhuma tentativa realizada.";

    phaseText.textContent =
        "Aguardando...";

    player1AttemptsText.textContent =
        "-";

    player2AttemptsText.textContent =
        "-";

    victoryScreen.style.display =
        "none";

    updateSideInfo();

}


// ======================================================
// UI
// ======================================================

function updateSideInfo(){

    currentPlayerText.textContent =
        `Jogador atual: ${currentPlayer}`;

    updateDifficultyText();

}


function updateDifficultyText(){

    let text = "Fácil";

    if(difficulty === "medium"){
        text = "Médio";
    }

    if(difficulty === "hard"){
        text = "Difícil";
    }

    difficultyText.textContent =
        `Dificuldade: ${text}`;

}