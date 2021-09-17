class Piece {
    movement = 2;
    alive = true;
    zones = [];

    fitness = 0;

    constructor(blockSize, padding) {
        this.blockSize = blockSize;
        this.isBest = false;
        this.padding = padding;
        this.brain = new Brain(2300);
        this.width = blockSize / 2;
        this.height = blockSize / 2;
        this.x = (0 + this.padding + this.blockSize * 4) / 2 - this.width / 2;
        //this.x = (0 + this.padding + this.blockSize * 6) / 2 - this.width / 2;
        this.y = (0 + this.padding + this.blockSize * 6) / 2 - this.height / 2;
        //this.y = (0 + this.padding + this.blockSize * 5);
    }

    draw = (fittest = false, avgFitness = 0) => {
        stroke(0);
        strokeWeight(1);
        if (this.isBest) fill('green');
        else if (fittest) fill('#007ACC');
        else if (this.fitness > avgFitness) fill('yellow');
        else fill('red');
        rect(this.x, this.y, this.width, this.height);
        //this.calculateFitness();
    }

    move = () => {
        if (this.brain.directions.length > this.brain.step) {
            let direction = this.brain.directions[this.brain.step];
            let moved = false;
            if (direction === 0 || direction === 1 || direction === 7) {
                moved = moved || this.moveUp();
            }
            if (direction === 5 || direction === 4 || direction === 3) {
                moved = moved || this.moveDown();
            }
            if (direction === 5 || direction === 6 || direction === 7) {
                moved = moved || this.moveLeft();
            }
            if (direction === 3 || direction === 1 || direction === 2) {
                moved = moved || this.moveRight();
            }
            //if (moved) this.brain.step += 1;
            //else {
            //    this.brain.directions[this.brain.step] = (this.brain.directions[this.brain.step] + 1) % 8;
            //}
            this.brain.step += 1;
        } else {
            this.alive = false;
        }
    }

    moveUp = () => {
        let y = this.y - this.movement;
        let ensured = false;
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isInsideZone(this.x, y, this.width, this.height)) {
                ensured = true;
                break;
            }
        }
        if (ensured) this.y = y;
        return ensured;
    }

    moveDown = () => {
        let y = this.y + this.movement;
        let ensured = false;
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isInsideZone(this.x, y, this.width, this.height)) {
                ensured = true;
                break;
            }
        }
        if (ensured) this.y = y;
        return ensured;
    }

    moveRight = () => {
        let x = this.x + this.movement;
        let ensured = false;
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isInsideZone(x, this.y, this.width, this.height)) {
                ensured = true;
                break;
            }
        }
        if (ensured) this.x = x;
        return ensured;
    }

    moveLeft = () => {
        let x = this.x - this.movement;
        let ensured = false;
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isInsideZone(x, this.y, this.width, this.height)) {
                ensured = true;
                break;
            }
        }
        if (ensured) this.x = x;
        return ensured;
    }

    calculateFitness = () => {
        let endzone = null;
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i] instanceof EndZone) {
                endzone = this.zones[i];
                break;
            }
        }
        if (!endzone) {
            console.log('No endzone found');
            return;
        };
        let distance = dist(this.x, this.y, endzone.x, this.y);
        let score = 1 / ((distance * distance) + this.brain.step);
        if (endzone.isInsideZone(this.x, this.y, this.width, this.height)) {
            this.fitness = 1 / (this.brain.step * this.brain.step);
        } else {
            this.fitness = score;
        }
    }

    gimmeBaby = () => {
        let baby = new Piece(this.blockSize, this.padding);
        baby.zones = this.zones;
        baby.brain = this.brain.clone();
        return baby;
    }
}