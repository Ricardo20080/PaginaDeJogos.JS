const board = document.getElementById("board");
const status = document.getElementById("status");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("reset");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let gameActive = false;
let current = "X";
let state = Array(9).fill("");

let points = {
    X: 0,
    O: 0
};

const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// ================= RENDER =================

function render(){
    board.innerHTML = "";

    state.forEach((value, index) => {

        const cell = document.createElement("div");
        cell.classList.add("cell");

        cell.innerText = value;

        cell.onclick = () => play(index);

        board.appendChild(cell);
    });
}

// ================= JOGADA =================

function play(i){

    if(!gameActive || state[i]) return;

    state[i] = current;

    render();

    checkWin();

    if(gameActive){
        current = current === "X" ? "O" : "X";
    }
}

// ================= VITÓRIA / EMPATE =================

function checkWin(){

    let hasWinner = false;

    for(let combo of wins){

        const [a,b,c] = combo;

        if(state[a] && state[a] === state[b] && state[a] === state[c]){

            hasWinner = true;

            gameActive = false;

            points[state[a]]++;

            updateScore();

            highlightWin(combo);

            status.innerText = `${state[a]} venceu!`;

            status.classList.add("win");

            return;
        }
    }

    if(!state.includes("") && !hasWinner){

        gameActive = false;

        status.innerText = "Empate!";

        status.classList.add("draw");
    }
}

// ================= DESTAQUE VITÓRIA =================

function highlightWin(combo){

    const cells = document.querySelectorAll(".cell");

    combo.forEach(i => {
        cells[i].classList.add("win");
    });
}

// ================= SCORE =================

function updateScore(){
    scoreX.innerText = points.X;
    scoreO.innerText = points.O;
}

// ================= START =================

startBtn.onclick = () => {

    gameActive = true;

    state = Array(9).fill("");

    current = "X";

    status.innerText = "Jogo iniciado!";

    status.classList.remove("win", "draw");

    render();
};

// ================= RESET =================

resetBtn.onclick = () => {

    state = Array(9).fill("");

    current = "X";

    gameActive = false;

    status.innerText = "Aguardando início...";

    status.classList.remove("win", "draw");

    render();
};

// INIT

render();