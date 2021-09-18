class Piece {
    movement = 2;
    alive = true;
    zones = [];

    fitness = 0;

    constructor(blockSize, padding) {
        this.blockSize = blockSize;
        this.isBest = false;
        this.padding = padding;
        this.brain = new Brain(5000);
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

    move = (obstacles) => {
        if (this.brain.size > this.brain.step) {
            //let direction = this.brain.getMove(this.x, this.y, obstacles);
            let direction = this.brain.directions[this.brain.step];
            let moved = false;
            if (direction[0] == 1) {
                moved = moved || this.moveUp();
            } else if (direction[0] == -1) {
                moved = moved || this.moveDown();
            }
            if (direction[1] == 1) {
                moved = moved || this.moveRight();
            } else if (direction[1] == -1) {
                moved = moved || this.moveLeft();
            }
            if (moved) this.brain.step += 1;
            else {
                //console.log('no movement', direction);
                this.brain.directions[this.brain.step] = this.brain.getRandomMove();
                //this.brain.learntmoves[this.brain.getKey(this.x,this.y,obstacles)] = this.brain.getRandomMove();
            }
            //else {
            //this.brain.directions[this.brain.step] = (this.brain.directions[this.brain.step] + 1) % 8;
            //}
            //this.brain.step += 1;
        } else {
            //this.brain.step = Math.min(this.brain.step + 1, this.brain.directions.length - 1);
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

    distanceBetweenTwoPoints = (x1, y1, x2, y2) => {
        let _dist = dist(x1, y1, x2, y2);
        if (x1 <= x2) return -_dist;
        else return _dist;
    }

    calculateFitness = (endzone, startZone) => {
        let distanceToTarget = this.distanceBetweenTwoPoints(this.x + this.width, this.y, endzone.x, this.y);
        let distanceFromSrc = this.distanceBetweenTwoPoints(this.x + this.width, this.y, startZone.x + startZone.width, startZone.y + startZone.height);
        let distance = distanceToTarget + distanceFromSrc / 2;//(10000 / Math.pow(distanceFromSrc,1));
        let dis_score = 1 / (distance * distance);
        //let step_score = 1 / (this.brain.step);
        let score = dis_score;// + step_score;
        //score = score / 2;
        if (endzone.isInsideZone(this.x, this.y, this.width, this.height)) {
            //this.fitness = 1 / (this.brain.step * this.brain.step);
            this.fitness = 1 + ((1 / (this.brain.step * this.brain.step)) + 1) / 2;
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

    loadJSON = (serializedObject) => {
        let instance = new Piece(0, 0);
        Object.assign(instance, serializedObject);

        instance.brain = new Brain(instance.brain.size, instance.brain.step);
        instance.brain = instance.brain.loadJSON(instance.brain);

        /*instance.zones = [];
        let zone = new Zone(0, 0);
        for (let i = 0; i < serializedObject.zones.length; i++) {
            instance.zones.push(zone.loadJSON(serializedObject.zones[i]));
        }*/

        return instance;
    }
}