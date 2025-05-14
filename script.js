const rows = 30;
const cols = 40;
const court = document.getElementById("court");

let playerPos = {x: 0, y: 0};
let lastPos = {x: 0, y: 0};
let direction = {x: 1, y: 0};
let trailActive = false;
let livesLeft = 3;

for (let y = 0; y < rows; y++){
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

function getCell(x, y){
    return document.querySelector(`.cell[pos-x="${x}"][pos-y="${y}"]`);
}

function drawPlayer(){
    document.querySelectorAll(".cell.player").forEach(cell => cell.classList.remove("player"));
    getCell(playerPos.x, playerPos.y).classList.add("player");

    if(!(getCell(playerPos.x, playerPos.y).classList.contains("conquered"))){
        
        trailActive = true;
    }

    if(trailActive === true && getCell(playerPos.x, playerPos.y).classList.contains("conquered")){
        getCell(lastPos.x, lastPos.y).classList.add("trail");
        trailActive = false;
        //...
    }

    if(trailActive === true && getCell(playerPos.x, playerPos.y).classList.contains("trail")){
        respawn(true);
    }
}

drawPlayer();

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (key === "arrowup" || key === "w"){
        direction = { x: 0, y: -1 };
    }

    if (key === "arrowdown" || key === "s"){
        direction = { x: 0, y: 1 };
    }

    if (key === "arrowleft" || key === "a"){
        direction = { x: -1, y: 0 };
    }

    if (key === "arrowright" || key === "d"){
        direction = { x: 1, y: 0 };
    }

    if (key === "r"){
        reset();
    }
});

setInterval(() => {
    lastPos.x = playerPos.x;
    lastPos.y = playerPos.y;

    const tempX = playerPos.x + direction.x;
    const tempY = playerPos.y + direction.y;

    if (tempX >= 0 && tempX < cols && tempY >= 0 && tempY < rows){
        playerPos.x = tempX;
        playerPos.y = tempY;
        drawPlayer();
    }
}, 50);

function reset(){
    livesLeft = 3;

    for (let y = 0; y < rows; y++){
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (!(x < 3 || x >= cols - 3 || y < 3 || y >= rows - 3)){
                cell.classList.add("conquered");
            } else {
                
            }
        }
    }
    //...
}

function respawn(gotDamage){
    if(gotDamage){
        livesLeft--;
    }

    if(livesLeft === 0){
        reset();
    }

    playerPos.x = 0;
    playerPos.y = 0;
}