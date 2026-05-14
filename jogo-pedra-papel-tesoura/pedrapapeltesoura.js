// ======================================================
// SELETORES
// ======================================================

const turnTitle = document.getElementById("turnTitle");
const roundMessage = document.getElementById("roundMessage");

const playerChoiceDisplay = document.getElementById("playerChoiceDisplay");
const computerChoiceDisplay = document.getElementById("computerChoiceDisplay");

const resultText = document.getElementById("resultText");

const currentPlayerText = document.getElementById("currentPlayer");
const gameModeText = document.getElementById("gameModeText");
const phaseStatus = document.getElementById("phaseStatus");

const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");

const startGameBtn = document.getElementById("startGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

const modeButtons = document.querySelectorAll(".mode-btn");
const choiceButtons = document.querySelectorAll(".choice-btn");


// ======================================================
// ESTADO DO JOGO
// ======================================================

const CHOICES = ["pedra", "papel", "tesoura"];

let gameStarted = false;

let currentMode = "3";

let currentPlayer = 1;

let player1Wins = 0;
let player2Wins = 0;

let playerMachineWins = 0;
let machineWins = 0;


// ======================================================
// LOCAL STORAGE
// ======================================================

loadScore();

function saveScore() {

    localStorage.setItem("ppt_player1", player1Wins);
    localStorage.setItem("ppt_player2", player2Wins);

}

function loadScore() {

    const savedP1 = localStorage.getItem("ppt_player1");
    const savedP2 = localStorage.getItem("ppt_player2");

    if(savedP1) player1Wins = Number(savedP1);
    if(savedP2) player2Wins = Number(savedP2);

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

updateScoreUI();
updateSideInfo();


// ======================================================
// EVENTOS
// ======================================================

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        if(gameStarted) return;

        modeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentMode = button.dataset.mode;

        updateSideInfo();

    });

});


startGameBtn.addEventListener("click", startGame);


resetScoreBtn.addEventListener("click", resetScoreboard);


choiceButtons.forEach(button => {

    button.addEventListener("click", () => {

        if(!gameStarted) return;

        const playerChoice = button.dataset.choice;

        playRound(playerChoice);

    });

});


// ======================================================
// INICIAR JOGO
// ======================================================

function startGame() {

    gameStarted = true;

    currentPlayer = 1;

    resetRoundCounters();

    turnTitle.textContent = "Jogador 1 está jogando";

    roundMessage.textContent = "Escolha Pedra, Papel ou Tesoura.";

    updateSideInfo();

}


// ======================================================
// RODADA
// ======================================================

function playRound(playerChoice) {

    const computerChoice = getComputerChoice();

    showChoices(playerChoice, computerChoice);

    const result = compareChoices(
        playerChoice,
        computerChoice
    );

    processRoundResult(result);

}


// ======================================================
// COMPUTADOR
// ======================================================

function getComputerChoice() {

    const randomIndex = Math.floor(
        Math.random() * CHOICES.length
    );

    return CHOICES[randomIndex];

}


// ======================================================
// COMPARAÇÃO
// ======================================================

function compareChoices(player, computer) {

    if(player === computer) {
        return "draw";
    }

    const rules = {

        pedra: "tesoura",
        papel: "pedra",
        tesoura: "papel"

    };

    return rules[player] === computer
        ? "win"
        : "lose";

}


// ======================================================
// PROCESSAR RESULTADO
// ======================================================

function processRoundResult(result) {

    if(result === "draw") {

        resultText.textContent =
            "Empate!";

        return;

    }

    if(result === "win") {

        playerMachineWins++;

        resultText.textContent =
            "Vitória!";

    }

    if(result === "lose") {

        machineWins++;

        resultText.textContent =
            "Derrota!";

    }

    checkModeProgress();

}


// ======================================================
// MODOS
// ======================================================

function checkModeProgress() {

    if(currentMode === "free") {
        updatePhaseText();
        return;
    }

    const limit = Number(currentMode);

    if(
        playerMachineWins >= limit ||
        machineWins >= limit
    ) {

        finishPlayerTurn();

        return;

    }

    updatePhaseText();

}


// ======================================================
// FIM DO TURNO
// ======================================================

function finishPlayerTurn() {

    const playerWonSeries =
        playerMachineWins > machineWins;

    if(playerWonSeries) {

        if(currentPlayer === 1) {
            player1Wins++;
        }

        else {
            player2Wins++;
        }

    }

    updateScoreUI();

    saveScore();

    if(currentPlayer === 1) {

        currentPlayer = 2;

        resetRoundCounters();

        turnTitle.textContent =
            "Passe para Jogador 2";

        setTimeout(() => {

            turnTitle.textContent =
                "Jogador 2 está jogando";

            updateSideInfo();

        }, 2000);

        return;

    }

    finishChampionship();

}


// ======================================================
// CAMPEONATO
// ======================================================

function finishChampionship() {

    gameStarted = false;

    let winnerMessage = "";

    if(player1Wins > player2Wins) {

        winnerMessage =
            "Jogador 1 venceu o campeonato!";

    }

    else if(player2Wins > player1Wins) {

        winnerMessage =
            "Jogador 2 venceu o campeonato!";

    }

    else {

        winnerMessage =
            "O campeonato terminou empatado!";

    }

    turnTitle.textContent =
        "Campeonato encerrado";

    resultText.textContent =
        winnerMessage;

}


// ======================================================
// RESET
// ======================================================

function resetScoreboard() {

    player1Wins = 0;
    player2Wins = 0;

    resetRoundCounters();

    currentPlayer = 1;

    gameStarted = false;

    localStorage.clear();

    updateScoreUI();

    updateSideInfo();

    turnTitle.textContent =
        "Aguardando início...";

    resultText.textContent =
        "Nenhuma rodada iniciada.";

}


// ======================================================
// AUXILIARES
// ======================================================

function resetRoundCounters() {

    playerMachineWins = 0;
    machineWins = 0;

    updatePhaseText();

}


function updateScoreUI() {

    player1ScoreElement.textContent =
        player1Wins;

    player2ScoreElement.textContent =
        player2Wins;

}


function updateSideInfo() {

    currentPlayerText.textContent =
        `Jogador atual: ${currentPlayer}`;

    gameModeText.textContent =
        `Modo: ${getModeName()}`;

}


function updatePhaseText() {

    phaseStatus.textContent =
        `Jogador ${currentPlayer}: ${playerMachineWins}
        x Máquina: ${machineWins}`;

}


function getModeName() {

    if(currentMode === "3") {
        return "Melhor de 3";
    }

    if(currentMode === "7") {
        return "Melhor de 7";
    }

    return "Modo Livre";

}


function showChoices(player, computer) {

    playerChoiceDisplay.textContent =
        getEmoji(player);

    computerChoiceDisplay.textContent =
        getEmoji(computer);

}


function getEmoji(choice) {

    const emojis = {

        pedra: "✊",
        papel: "📄",
        tesoura: "✂️"

    };

    return emojis[choice];

}