const blockSize = 40;
const padding = 10;

const CANVAS_WIDTH = blockSize * 20 + padding * 2;
const CANVAS_HEIGHT = blockSize * 6 + padding * 2;

let startZone;
let startPath;
let midAlley;
let endPath;
let endZone;

let startzonestartpathjoiner;
let startpathmidalleyjoiner;
let midalleyendpathjoiner;
let endpathendzonejoiner;

let piece;
let obstacles;

let GAME_WON = false;


function start() {
    startZone = new StartZone(blockSize, padding);
    startPath = new StartPath(blockSize, padding);
    midAlley = new MidAlley(blockSize, padding);
    endPath = new EndPath(blockSize, padding);
    endZone = new EndZone(blockSize, padding);

    startzonestartpathjoiner = new StartZoneStartPathJoiner(blockSize, padding);
    startpathmidalleyjoiner = new StartPathMidAlleyJoiner(blockSize, padding);
    midalleyendpathjoiner = new MidAlleyEndPathJoiner(blockSize, padding);
    endpathendzonejoiner = new EndPathEndZoneJoiner(blockSize, padding);

    piece = new Piece(blockSize, padding);
    obstacles = new Obstacles(blockSize, padding);

    GAME_WON = false;

    piece.zones.push(startZone);
    piece.zones.push(startPath);
    piece.zones.push(midAlley);
    piece.zones.push(endPath);
    piece.zones.push(endZone);

    piece.zones.push(startzonestartpathjoiner);
    piece.zones.push(startpathmidalleyjoiner);
    piece.zones.push(midalleyendpathjoiner);
    piece.zones.push(endpathendzonejoiner);
}

function setup() {
    //createCanvas(blockSize * 20 + padding * 2, blockSize * 6 + padding * 2);
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('sketch-holder');
    start();
}

function draw() {
    background('#B5B5FF');
    startZone.draw();
    startPath.draw();
    midAlley.draw();
    endPath.draw();
    endZone.draw();

    piece.draw();
    obstacles.draw(piece.alive);
    detectWin();

    if (GAME_WON) {
        stroke(3);
        fill('#E4E5EA');
        textSize(48);
        textAlign(CENTER, CENTER);
        text("YOU WIN", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        textSize(24);
        text("Click to restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }

    if (piece.alive && !GAME_WON) {
        // check moves
        checkMoves();

        detectCollision();
    } else if (!GAME_WON) {
        stroke(2);
        fill('#E4E5EA');
        textSize(32);
        textAlign(CENTER, CENTER);
        text("YOU LOSE", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        textSize(24);
        text("Click to restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
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

function mouseClicked() {
    if (GAME_WON || !piece.alive) {
        start();
        return false;
    }
}