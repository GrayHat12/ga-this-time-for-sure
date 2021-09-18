const blockSize = 40;
const padding = 10;

const CANVAS_WIDTH = blockSize * 20 + padding * 2;
const CANVAS_HEIGHT = blockSize * 6 + padding * 2;

const speedSlider = document.getElementById('speed-slider');
const showDeadCheckBox = document.getElementById('show-dead');
const showBestPlayersOnlyCheckBox = document.getElementById('show-best');

const saveButton = document.getElementById('save');
const loadButton = document.getElementById('load');
const loadPretrainedButton = document.getElementById('load-pre');
const loadFile = document.getElementById('loadFile');

let speed = 1;


let god = new God(blockSize, padding);


function setup() {
    //createCanvas(blockSize * 20 + padding * 2, blockSize * 6 + padding * 2);
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('sketch-holder');
    //start();
}

function draw() {
    background('#B5B5FF');
    frameRate(240);
    for (let i = 0; i < speed; i++) {
        god.draw();
    }
}

function checkMoves() {
    if (keyIsDown(LEFT_ARROW)) {
        piece.moveLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        piece.moveRight();
    }
    if (keyIsDown(UP_ARROW)) {
        piece.moveUp();
    }
    if (keyIsDown(DOWN_ARROW)) {
        piece.moveDown();
    }
}

function detectCollision() {
    let hasCollided = false;
    for (let i = 0; i < obstacles.obstacles.length; i++) {
        let obstacle = obstacles.obstacles[i];
        let distance = dist(piece.x + piece.width / 2, piece.y + piece.width / 2, obstacle.x, obstacle.y);
        if (distance < ((piece.width / 2) + obstacle.radius)) {
            hasCollided = true;
            piece.alive = false;
            break;
        }
    }
    return hasCollided;
}

function detectWin() {
    if (endZone.isInsideZone(piece.x, piece.y, piece.width, piece.height)) {
        GAME_WON = true;
    }
    GAME_WON = false;
}

function findAlivePlayers() {
    return god.population.filter(player => player.alive);
}

function readTextFile(file) {
    let reader = new FileReader();
    reader.addEventListener('load', function (e) {
        let data = e.target.result;
        //console.log(data);
        try {
            let newgod = unserialize(data, God);
            god = newgod;
            god.displayInfo();
        } catch (e) {
            console.error(e);
            alert(e);
        }
    });
    reader.readAsText(file);
}

speedSlider.onchange = function () {
    speed = parseInt(`${speedSlider.value}`);
}

showDeadCheckBox.onchange = function () {
    god.showDEAD = showDeadCheckBox.checked;
}

loadButton.onclick = function () {
    loadFile.click();
}

loadFile.onchange = function () {
    let file = loadFile.files[0];
    console.log(file);
    readTextFile(file);
}

saveButton.onclick = function () {
    serialize(god);
}

showBestPlayersOnlyCheckBox.onchange = function () {
    god.showBEST = showBestPlayersOnlyCheckBox.checked;
}

function readPretrained(file = "assets/saved_GEN-208.json") {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                let allText = rawFile.responseText;
                let newgod = unserialize(allText, God);
                god = newgod;
                god.displayInfo();
                console.log(god);
                //alert(allText);
            }
        }
    }
    rawFile.send(null);
}

loadPretrainedButton.onclick = function () {
    readPretrained();
}