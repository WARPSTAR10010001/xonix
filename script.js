const rows = 30;
const cols = 40;
const court = document.getElementById("court");

let playerX = 0;
let playerY = 0;
let direction = { x: 1, y: 0 };
let trailActive = false;
let livesLeft = 3;

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (x < 3 || x >= cols - 3 || y < 3 || y >= rows - 3) {
            cell.classList.add("conquered");
        }
        cell.setAttribute('pos-x', x);
        cell.setAttribute('pos-y', y);
        court.appendChild(cell);
    }
}

function getCell(x, y) {
    return document.querySelector(`.cell[pos-x="${x}"][pos-y="${y}"]`);
}

function drawPlayer() {
    document.querySelectorAll(".cell.player").forEach(cell => cell.classList.remove("player"));
    getCell(playerX, playerY).classList.add("player");

    if(!(getCell(playerX, playerY).classList.contains("conquered"))){
        getCell(playerX, playerY).classList.add("trail");
        trailActive = true;
    }

    if(trailActive === true && getCell(playerX, playerY).classList.contains("conquered")){
        trailActive = false;
        //...
    }

    /* if(trailActive === true && getCell(playerX, playerY).classList.contains("trail")){
        respawn(true);
    } */
}

drawPlayer();

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (key === "arrowup" || key === "w") {
        direction = { x: 0, y: -1 };
    }

    if (key === "arrowdown" || key === "s") {
        direction = { x: 0, y: 1 };
    }

    if (key === "arrowleft" || key === "a") {
        direction = { x: -1, y: 0 };
    }

    if (key === "arrowright" || key === "d") {
        direction = { x: 1, y: 0 };
    }

    if (key === "r") {
        reset();
    }
});

setInterval(() => {
    const newX = playerX + direction.x;
    const newY = playerY + direction.y;

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        playerX = newX;
        playerY = newY;
        drawPlayer();
    }
}, 50);

function reset(){
    //...
}

function respawn(gotDamage){
    if(gotDamage){
        livesLeft--;
    }

    if(livesLeft === 0){
        reset();
    }

    playerX = 0;
    playerY = 0;
}