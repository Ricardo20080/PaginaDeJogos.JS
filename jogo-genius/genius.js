// ======================================
// ELEMENTOS
// ======================================

const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const message =
    document.getElementById("message");

const turnTitle =
    document.getElementById("turnTitle");

const currentPlayerText =
    document.getElementById("currentPlayerText");

const roundText =
    document.getElementById("roundText");

const player1ScoreText =
    document.getElementById("player1Score");

const player2ScoreText =
    document.getElementById("player2Score");

const recordText =
    document.getElementById("recordText");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const gameOverText =
    document.getElementById("gameOverText");

const blocks =
    document.querySelectorAll(".color");


// ======================================
// ÁUDIOS
// ======================================

const sounds = {

    green:
        document.getElementById("soundGreen"),

    red:
        document.getElementById("soundRed"),

    yellow:
        document.getElementById("soundYellow"),

    blue:
        document.getElementById("soundBlue")

};


// ======================================
// ESTADO DO JOGO
// ======================================

const colors = [
    "green",
    "red",
    "yellow",
    "blue"
];

let sequence = [];

let playerSequence = [];

let currentPlayer = 1;

let currentRound = 0;

let currentScore = 0;

let player1FinalScore = 0;

let player2FinalScore = 0;

let canClick = false;

let championshipStarted = false;


// ======================================
// EVENTOS
// ======================================

startBtn.addEventListener(
    "click",
    startChampionship
);

restartBtn.addEventListener(
    "click",
    restartChampionship
);


blocks.forEach(block => {

    block.addEventListener(
        "click",
        () => handlePlayerClick(block)
    );

});


// ======================================
// RECORD
// ======================================

loadRecord();

function loadRecord(){

    const record =
        Number(
            localStorage.getItem(
                "genius_record"
            )
        ) || 0;

    recordText.textContent =
        `${record} pontos`;

}


function saveRecord(score){

    const record =
        Number(
            localStorage.getItem(
                "genius_record"
            )
        ) || 0;

    if(score > record){

        localStorage.setItem(
            "genius_record",
            score
        );

    }

    loadRecord();

}


// ======================================
// INICIAR CAMPEONATO
// ======================================

function startChampionship(){

    championshipStarted = true;

    currentPlayer = 1;

    player1FinalScore = 0;
    player2FinalScore = 0;

    player1ScoreText.textContent = 0;
    player2ScoreText.textContent = 0;

    startBtn.disabled = true;

    gameOverScreen.style.display =
        "none";

    startPlayerTurn();

}


// ======================================
// INICIAR TURNO
// ======================================

function startPlayerTurn(){

    sequence = [];

    playerSequence = [];

    currentRound = 0;

    currentScore = 0;

    turnTitle.textContent =
        `Jogador ${currentPlayer}`;

    currentPlayerText.textContent =
        `Jogador atual: ${currentPlayer}`;

    nextRound();

}


// ======================================
// NOVA RODADA
// ======================================

function nextRound(){

    currentRound++;

    roundText.textContent =
        `Rodada: ${currentRound}`;

    message.textContent =
        "Memorize a sequência...";

    playerSequence = [];

    addColorToSequence();

    showSequence();

}


// ======================================
// ADICIONAR COR
// ======================================

function addColorToSequence(){

    const randomColor =

        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];

    sequence.push(
        randomColor
    );

}


// ======================================
// MOSTRAR SEQUÊNCIA
// ======================================

function showSequence(){

    canClick = false;

    let i = 0;

    const interval = setInterval(() => {

        flash(
            sequence[i]
        );

        i++;

        if(
            i >= sequence.length
        ){

            clearInterval(
                interval
            );

            canClick = true;

            message.textContent =
                "Sua vez!";

        }

    }, 700);

}


// ======================================
// CLIQUE DO JOGADOR
// ======================================

function handlePlayerClick(block){

    if(
        !canClick ||
        !championshipStarted
    ){

        return;

    }

    const color =
        block.dataset.color;

    flash(color);

    playerSequence.push(
        color
    );

    checkMove(
        playerSequence.length - 1
    );

}


// ======================================
// VERIFICAÇÃO
// ======================================

function checkMove(index){

    if(

        playerSequence[index] !==
        sequence[index]

    ){

        gameOver();

        return;

    }


    if(

        playerSequence.length ===
        sequence.length

    ){

        currentScore++;

        message.textContent =
            "Boa! Próxima rodada...";

        canClick = false;

        setTimeout(() => {

            nextRound();

        }, 1000);

    }

}


// ======================================
// FLASH + SOM
// ======================================

function flash(color){

    const el =
        document.querySelector(
            `.${color}`
        );

    playSound(color);

    el.classList.add(
        "active"
    );

    setTimeout(() => {

        el.classList.remove(
            "active"
        );

    }, 300);

}


function playSound(color){

    const sound =
        sounds[color];

    if(!sound) return;

    sound.currentTime = 0;

    sound.play();

}


// ======================================
// GAME OVER
// ======================================

function gameOver(){

    canClick = false;

    saveRecord(
        currentScore
    );

    showGameOver();

    if(currentPlayer === 1){

        player1FinalScore =
            currentScore;

        player1ScoreText.textContent =
            currentScore;

        currentPlayer = 2;

        setTimeout(() => {

            startPlayerTurn();

        }, 2500);

        return;

    }


    player2FinalScore =
        currentScore;

    player2ScoreText.textContent =
        currentScore;

    finishChampionship();

}


// ======================================
// TELA DE DERROTA
// ======================================

function showGameOver(){

    gameOverScreen.style.display =
        "block";

    gameOverText.textContent =

        `Você chegou em ${currentScore} pontos`;

    setTimeout(() => {

        gameOverScreen.style.display =
            "none";

    }, 2000);

}


// ======================================
// FINAL
// ======================================

function finishChampionship(){

    championshipStarted = false;

    startBtn.disabled = false;

    let winnerText = "";

    if(

        player1FinalScore >
        player2FinalScore

    ){

        winnerText =
            "🏆 Jogador 1 venceu!";

    }

    else if(

        player2FinalScore >
        player1FinalScore

    ){

        winnerText =
            "🏆 Jogador 2 venceu!";

    }

    else{

        winnerText =
            "🤝 Empate!";

    }

    turnTitle.textContent =
        "Campeonato encerrado";

    message.textContent =
        winnerText;

}


// ======================================
// REINICIAR
// ======================================

function restartChampionship(){

    championshipStarted = false;

    currentPlayer = 1;

    currentRound = 0;

    currentScore = 0;

    sequence = [];

    playerSequence = [];

    canClick = false;

    player1FinalScore = 0;

    player2FinalScore = 0;

    player1ScoreText.textContent =
        0;

    player2ScoreText.textContent =
        0;

    roundText.textContent =
        "Rodada: 0";

    turnTitle.textContent =
        "Aguardando início...";

    message.textContent =
        "Clique em iniciar.";

    currentPlayerText.textContent =
        "Jogador atual: -";

    gameOverScreen.style.display =
        "none";

    startBtn.disabled = false;

}