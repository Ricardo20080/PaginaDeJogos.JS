// ======================================================
// ELEMENTOS
// ======================================================

const turnTitle =
    document.getElementById("turnTitle");

const roundMessage =
    document.getElementById("roundMessage");

const resultText =
    document.getElementById("resultText");

const currentPlayerText =
    document.getElementById("currentPlayer");

const gameModeText =
    document.getElementById("gameModeText");

const phaseStatus =
    document.getElementById("phaseStatus");

const playerChoiceDisplay =
    document.getElementById("playerChoiceDisplay");

const computerChoiceDisplay =
    document.getElementById("computerChoiceDisplay");

const player1ScoreElement =
    document.getElementById("player1Score");

const player2ScoreElement =
    document.getElementById("player2Score");

const startGameBtn =
    document.getElementById("startGameBtn");

const resetScoreBtn =
    document.getElementById("resetScoreBtn");

const modeButtons =
    document.querySelectorAll(".mode-btn");

const choiceButtons =
    document.querySelectorAll(".choice-btn");


// ======================================================
// CONFIG
// ======================================================

const CHOICES = [
    "pedra",
    "papel",
    "tesoura"
];

const EMOJIS = {

    pedra: "✊",
    papel: "📄",
    tesoura: "✂️"

};


// ======================================================
// ESTADO DO JOGO
// ======================================================

let gameStarted = false;

let currentPlayer = 1;

let currentMode = "3";

let roundsPlayed = 0;

let playerWinsAgainstMachine = 0;

let machineWins = 0;


// ======================================================
// PLACAR GERAL (HISTÓRICO)
// ======================================================

let player1Championships = 0;

let player2Championships = 0;


// ======================================================
// RESULTADO DO CAMPEONATO ATUAL
// ======================================================

let player1SeriesWins = 0;

let player2SeriesWins = 0;


// ======================================================
// LOCAL STORAGE
// ======================================================

loadScore();

function loadScore() {

    const p1 =
        localStorage.getItem("ppt_player1");

    const p2 =
        localStorage.getItem("ppt_player2");

    player1Championships =
        Number(p1) || 0;

    player2Championships =
        Number(p2) || 0;

}


function saveScore() {

    localStorage.setItem(
        "ppt_player1",
        player1Championships
    );

    localStorage.setItem(
        "ppt_player2",
        player2Championships
    );

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

updateScoreUI();
updateSideInfo();
updatePhaseText();


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

        currentMode =
            button.dataset.mode;

        updateSideInfo();
        updatePhaseText();

    });

});


startGameBtn.addEventListener(
    "click",
    startGame
);


resetScoreBtn.addEventListener(
    "click",
    resetScoreboard
);


choiceButtons.forEach(button => {

    button.addEventListener("click", () => {

        if(!gameStarted) return;

        const playerChoice =
            button.dataset.choice;

        playRound(playerChoice);

    });

});


// ======================================================
// INICIAR JOGO
// ======================================================

function startGame() {

    gameStarted = true;

    currentPlayer = 1;

    player1SeriesWins = 0;
    player2SeriesWins = 0;

    resetPlayerSeries();


    // ==================================================
    // MODO LIVRE
    // ==================================================

    if(currentMode === "free") {

        turnTitle.textContent =
            "Modo Livre";

        roundMessage.textContent =
            "Jogue infinitamente contra a máquina.";

        resultText.textContent =
            "Boa sorte!";

        currentPlayerText.textContent =
            "Singleplayer";

        updatePhaseText();

        return;

    }


    // ==================================================
    // MODOS MULTIPLAYER
    // ==================================================

    turnTitle.textContent =
        "Jogador 1 está jogando";

    roundMessage.textContent =
        "Escolha Pedra, Papel ou Tesoura.";

    resultText.textContent =
        "Boa sorte!";

    updateSideInfo();

}


// ======================================================
// RODADA
// ======================================================

function playRound(playerChoice) {

    const computerChoice =
        getComputerChoice();

    showChoices(
        playerChoice,
        computerChoice
    );

    const result =
        compareChoices(
            playerChoice,
            computerChoice
        );

    processRoundResult(result);

}


// ======================================================
// ESCOLHA DA MÁQUINA
// ======================================================

function getComputerChoice() {

    const randomIndex =
        Math.floor(
            Math.random() *
            CHOICES.length
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
// RESULTADO DA RODADA
// ======================================================

function processRoundResult(result) {

    // ==================================================
    // EMPATE NÃO CONTA
    // ==================================================

    if(result !== "draw") {

        roundsPlayed++;

    }


    // ==================================================
    // RESULTADO
    // ==================================================

    if(result === "draw") {

        resultText.textContent =
            "Empate!";

    }

    else if(result === "win") {

        playerWinsAgainstMachine++;

        resultText.textContent =
            "Vitória!";

    }

    else {

        machineWins++;

        resultText.textContent =
            "Derrota!";

    }


    // ==================================================
    // UI
    // ==================================================

    updatePhaseText();


    // ==================================================
    // LIMPA ESCOLHAS
    // ==================================================

    clearChoices();


    // ==================================================
    // VERIFICA FIM
    // ==================================================

    checkSeriesEnd();

}


// ======================================================
// FIM DA SÉRIE
// ======================================================

function checkSeriesEnd() {

    // ==================================================
    // MODO LIVRE NÃO TERMINA
    // ==================================================

    if(currentMode === "free") {

        return;

    }

    const maxRounds =
        Number(currentMode);

    if(roundsPlayed >= maxRounds) {

        finishPlayerTurn();

    }

}


// ======================================================
// FINALIZA TURNO
// ======================================================

function finishPlayerTurn() {

    const playerWonSeries =

        playerWinsAgainstMachine >
        machineWins;


    // ==================================================
    // JOGADOR VENCEU A SÉRIE
    // ==================================================

    if(playerWonSeries) {

        if(currentPlayer === 1) {

            player1Championships++;
            player1SeriesWins++;

        }

        else {

            player2Championships++;
            player2SeriesWins++;

        }

    }

    updateScoreUI();

    saveScore();


    // ==================================================
    // MODO LIVRE
    // ==================================================

    if(currentMode === "free") {

        return;

    }


    // ==================================================
    // TROCA PARA JOGADOR 2
    // ==================================================

    if(currentPlayer === 1) {

        currentPlayer = 2;

        resetPlayerSeries();

        turnTitle.textContent =
            "Passe para Jogador 2";

        resultText.textContent =
            "Troca de jogador...";

        updateSideInfo();

        setTimeout(() => {

            turnTitle.textContent =
                "Jogador 2 está jogando";

            resultText.textContent =
                "Boa sorte!";

        }, 2000);

        return;

    }


    // ==================================================
    // FINALIZA CAMPEONATO
    // ==================================================

    finishChampionship();

}


// ======================================================
// FINAL DO CAMPEONATO
// ======================================================

function finishChampionship() {

    gameStarted = false;

    let winnerMessage = "";


    // ==================================================
    // RESULTADO DA PARTIDA ATUAL
    // ==================================================

    if(
        player1SeriesWins >
        player2SeriesWins
    ) {

        winnerMessage =
            "🏆 Jogador 1 venceu o campeonato!";

    }

    else if(
        player2SeriesWins >
        player1SeriesWins
    ) {

        winnerMessage =
            "🏆 Jogador 2 venceu o campeonato!";

    }

    else {

        winnerMessage =
            "🤝 O campeonato terminou empatado!";

    }


    turnTitle.textContent =
        "Campeonato encerrado";

    resultText.textContent =
        winnerMessage;

    roundMessage.textContent =
        "Clique em iniciar para jogar novamente.";

}


// ======================================================
// RESET
// ======================================================

function resetScoreboard() {

    gameStarted = false;

    currentPlayer = 1;

    roundsPlayed = 0;

    playerWinsAgainstMachine = 0;

    machineWins = 0;

    player1Championships = 0;

    player2Championships = 0;

    player1SeriesWins = 0;

    player2SeriesWins = 0;


    // ==================================================
    // REMOVE APENAS ESSE JOGO
    // ==================================================

    localStorage.removeItem(
        "ppt_player1"
    );

    localStorage.removeItem(
        "ppt_player2"
    );


    clearChoicesImmediately();

    updateScoreUI();

    updateSideInfo();

    updatePhaseText();


    turnTitle.textContent =
        "Aguardando início...";

    roundMessage.textContent =
        "Escolha um modo e inicie o campeonato.";

    resultText.textContent =
        "Nenhuma rodada iniciada.";

}


// ======================================================
// RESET DA SÉRIE
// ======================================================

function resetPlayerSeries() {

    roundsPlayed = 0;

    playerWinsAgainstMachine = 0;

    machineWins = 0;

    clearChoicesImmediately();

    updatePhaseText();

}


// ======================================================
// UI
// ======================================================

function updateScoreUI() {

    player1ScoreElement.textContent =
        player1Championships;

    player2ScoreElement.textContent =
        player2Championships;

}


function updateSideInfo() {

    currentPlayerText.textContent =
        `Jogador atual: ${currentPlayer}`;

    gameModeText.textContent =
        `Modo: ${getModeName()}`;

}


function updatePhaseText() {

    // ==================================================
    // MODO LIVRE
    // ==================================================

    if(currentMode === "free") {

        phaseStatus.textContent =

            `Livre | Vitórias: ${playerWinsAgainstMachine}
             x Derrotas: ${machineWins}`;

        return;

    }


    // ==================================================
    // MODOS NORMAIS
    // ==================================================

    const maxRounds =
        Number(currentMode);

    phaseStatus.textContent =

        `Rodada ${roundsPlayed}/${maxRounds}
         | Jogador: ${playerWinsAgainstMachine}
         x Máquina: ${machineWins}`;

}


// ======================================================
// AUXILIARES
// ======================================================

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
        EMOJIS[player];

    computerChoiceDisplay.textContent =
        EMOJIS[computer];

}


// ======================================================
// LIMPA ESCOLHAS COM DELAY
// ======================================================

function clearChoices() {

    setTimeout(() => {

        clearChoicesImmediately();

    }, 2000);

}


// ======================================================
// LIMPA ESCOLHAS IMEDIATAMENTE
// ======================================================

function clearChoicesImmediately() {

    playerChoiceDisplay.textContent =
        "?";

    computerChoiceDisplay.textContent =
        "?";

}