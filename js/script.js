const blockSize = 40;
const padding = 10;

const CANVAS_WIDTH = blockSize * 20 + padding * 2;
const CANVAS_HEIGHT = blockSize * 6 + padding * 2;

const speedSlider = document.getElementById('speed-slider');

let speed = 1;


const god = new God(blockSize, padding);


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

speedSlider.onchange = function () {
    speed = parseInt(`${speedSlider.value}`);
}