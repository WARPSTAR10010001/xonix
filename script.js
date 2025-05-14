const rows = 30;
const cols = 40;
const court = document.getElementById("court");

var playerPos = {x: 0, y: 0};
var lastPos = {x: 0, y: 0};
var direction = {x: 1, y: 0};
var trailActive = false;
var livesLeft = 3;
var tickRate = 50;
var paused = false;

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

function getCell(x, y){
    return document.querySelector('.cell[pos-x="' + x + '"][pos-y="' + y + '"]');
}

function drawPlayer(){
    var currentPlayerCell = document.querySelector(".cell.player");
    if(currentPlayerCell !== null){
        currentPlayerCell.classList.remove("player");
    }

    getCell(playerPos.x, playerPos.y).classList.add("player");

    if(!getCell(playerPos.x, playerPos.y).classList.contains("conquered")){
        if (!getCell(lastPos.x, lastPos.y).classList.contains("conquered")){
            getCell(lastPos.x, lastPos.y).classList.add("trail");
        }
        trailActive = true;
    }

    if(trailActive === true && getCell(playerPos.x, playerPos.y).classList.contains("conquered")){
        trailActive = false;
        getCell(lastPos.x, lastPos.y).classList.add("trail");
    }

    if(trailActive === true && getCell(playerPos.x, playerPos.y).classList.contains("trail")){
        respawn();
    }

    if(getCell(playerPos.x, playerPos.y).classList.contains("obstacle")){
        respawn();
    }
}

drawPlayer();

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
        if(!paused){
            tickRate = 0;
            paused = true;
        }else{
            tickRate = 50;
            paused = false;
        }
    }
});

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
        }
    }
}

setInterval(gameTick, tickRate);

function reset(){
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
            reset();
        }
    }, 1000);
}