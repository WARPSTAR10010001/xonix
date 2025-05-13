const rows = 30;
const cols = 40;
const court = document.getElementById("court");

let playerX = 0;
let playerY = 0;
let direction = { x: 1, y: 0 };

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (x < 3 || x >= cols - 3 || y < 3 || y >= rows - 3) {
            cell.classList.add("captured");
        }
        cell.dataset.x = x;
        cell.dataset.y = y;
        court.appendChild(cell);
    }
}

function getCell(x, y) {
    return document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
}

function drawPlayer() {
    document.querySelectorAll(".cell.player").forEach(cell => cell.classList.remove("player"));
    getCell(playerX, playerY).classList.add("player");
}

drawPlayer();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
        case "s":
        case "S":
            direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
        case "d":
        case "D":
            direction = { x: 1, y: 0 };
            break;
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