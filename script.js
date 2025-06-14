const rows = 30;
const cols = 40;
const totalAmount = rows * cols;
const court = document.getElementById("court");

var playerPos = {x: 0, y: 0};
var lastPos = {x: 0, y: 0};
var direction = {x: 1, y: 0};
var trailActive = false;
var livesLeft = 3;
var paused = false;
var completed = 0;
var grid;

for(var y = 0; y < rows; y++){
    for(var x = 0; x < cols; x++){
        var cell = document.createElement("div");
        cell.classList.add("cell");
        if(x < 3 || x >= cols - 3 || y < 3 || y >= rows - 3){
            cell.classList.add("conquered");
        }
        cell.setAttribute('pos-x', x);
        cell.setAttribute('pos-y', y);
        court.appendChild(cell);
    }
}

paused = true;
showOverlay("Willkommen zu XONIX", "'R' drücken, um Spiel zu starten");
drawPlayer();
setInterval(gameTick, 50);
grid = generateGrid();

document.addEventListener("keydown", function(e){
    var key = e.key.toLowerCase();

    if(key === "arrowup" || key === "w"){
        direction = {x: 0, y: -1};
    }

    if(key === "arrowdown" || key === "s"){
        direction = {x: 0, y: 1};
    }

    if(key === "arrowleft" || key === "a"){
        direction = {x: -1, y: 0};
    }

    if(key === "arrowright" || key === "d"){
        direction = {x: 1, y: 0};
    }

    if(key === "r"){
        reset();
    }

    if(key === "p"){
        paused = !paused;
        
        if (paused === true) {
            showOverlay("SPIEL PAUSIERT", "'P' drücken, um fortzufahren");
        } else {
            hideOverlay();
        }
    }
});

function getCell(x, y){
    return document.querySelector('.cell[pos-x="' + x + '"][pos-y="' + y + '"]');
}

function drawPlayer(){
    var currentPlayerCell = document.querySelector(".cell.player");
    if(currentPlayerCell !== null){
        currentPlayerCell.classList.remove("player");
    }

    getCell(playerPos.x, playerPos.y).classList.add("player");

    if(completed >= 75){
        win();
    }

    if(!getCell(playerPos.x, playerPos.y).classList.contains("conquered")){
        if (!getCell(lastPos.x, lastPos.y).classList.contains("conquered")){
            getCell(lastPos.x, lastPos.y).classList.add("trail");
        }
        trailActive = true;
    }

    if(trailActive === true && getCell(playerPos.x, playerPos.y).classList.contains("conquered")){
        trailActive = false;
        var trailedCells = document.querySelectorAll(".cell.trail");
        for(var i = 0; i < trailedCells.length; i++){
            trailedCells[i].classList.add("conquered");
            trailedCells[i].classList.remove("trail");
        }
        getCell(lastPos.x, lastPos.y).classList.add("conquered");
    }

    if(trailActive === true && getCell(playerPos.x, playerPos.y).classList.contains("trail")){
        respawn();
    }

    if(getCell(playerPos.x, playerPos.y).classList.contains("obstacle")){
        respawn();
    }
}

function gameTick(){
    if(!paused){
        lastPos.x = playerPos.x;
        lastPos.y = playerPos.y;

        var tempX = playerPos.x + direction.x;
        var tempY = playerPos.y + direction.y;

        if(tempX >= 0 && tempX < cols && tempY >= 0 && tempY < rows){
            playerPos.x = tempX;
            playerPos.y = tempY;
            drawPlayer();

            var grid = generateGrid();
            floodFillArea(grid);
        }
    }
}

function reset(){
    hideOverlay();
    paused = false;
    livesLeft = 3;
    trailActive = false;
    playerPos.x = 0;
    playerPos.y = 0;
    lastPos.x = 0;
    lastPos.y = 0;
    direction.x = 1;
    direction.y = 0;

    document.getElementById("lives").innerHTML = livesLeft;
    document.getElementById("time").innerHTML = "00:00";

    var cells = document.getElementsByClassName("cell");
    for (var i = 0; i < cells.length; i++) {
        let cell = cells[i];
        let x = parseInt(cell.getAttribute("pos-x"));
        let y = parseInt(cell.getAttribute("pos-y"));

        if (!(x < 3 || x >= cols - 3 || y < 3 || y >= rows - 3)) {
            cell.classList.remove("trail");
            cell.classList.remove("obstacle");
            cell.classList.remove("conquered");
            cell.classList.remove("player");
        }
    }

    drawPlayer();
}

function respawn(){
    paused = false;
    trailActive = false;
    livesLeft--;
    document.getElementById("lives").innerHTML = livesLeft;

    paused = true;

    setTimeout(() => {
        playerPos.x = 0;
        playerPos.y = 0;
        lastPos.x = 0;
        lastPos.y = 0;
        direction.x = 1;
        direction.y = 0;

        drawPlayer();
        paused = false;

        var cells = document.getElementsByClassName("cell");
        for (var i = 0; i < cells.length; i++) {
            let cell = cells[i];
            let x = parseInt(cell.getAttribute("pos-x"));
            let y = parseInt(cell.getAttribute("pos-y"));

            if (!(x < 3 || x >= cols - 3 || y < 3 || y >= rows - 3)) {
                cell.classList.remove("trail");
            }
        }

        if (livesLeft === 0){
            setTimeout(() => {
                showOverlay("GAME OVER", "'R' drücken, um neuzustarten");
                paused = true;
            }, 0);
            reset();
        }
    }, 1000);
}

function showOverlay(message, subMessage){
    var overlay = document.getElementById("overlay");
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
    document.getElementById("overlay-text").innerText = message;
    document.getElementById("overlay-subtext").innerText = subMessage;
    document.getElementById("court").classList.add("blurred");
}

function hideOverlay(){
    var overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    document.getElementById("court").classList.remove("blurred");
}

function generateGrid(){
    const grid = [];

    for(let y = 0; y < rows; y++){
        const row = [];

        for(let x = 0; x < cols; x++){
            const cell = getCell(x, y);

            if(cell.classList.contains("conquered")){
                row.push("conquered");
            } else if(cell.classList.contains("trail")){
                row.push("trail");
            } else if(cell.classList.contains("obstacle")){
                row.push("obstacle");
            } else if(cell.classList.contains("player")){
                row.push("player");
            } else {
                row.push("empty");
            }
        }

        grid.push(row);
    }

    return grid;
}

function floodFillArea(grid){
    var visited = [];
    for(var y = 0; y < rows; y++){
        visited[y] = [];
        for(var x = 0; x < cols; x++){
            visited[y][x] = false;
        }
    }

    var queue = [[3, 3]];
    while(queue.length > 0){
        var pos = queue.shift();
        var x = pos[0];
        var y = pos[1];
        if(x < 0 || x >= cols || y < 0 || y >= rows) continue;
        if(visited[y][x]) continue;
        if(grid[y][x] === "conquered" || grid[y][x] === "trail" || grid[y][x] === "obstacle") continue;

        visited[y][x] = true;

        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
    }

    for(var y = 0; y < rows; y++){
        for(var x = 0; x < cols; x++){
            if(!visited[y][x] && grid[y][x] === "empty"){
                var cell = getCell(x,y);
                cell.classList.add("conquered");
                cell.classList.remove("trail");
            }
        }
    }
}