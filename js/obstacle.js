class Obstacles {
    constructor(blockSize, padding) {
        this.blockSize = blockSize;
        this.padding = padding;
        this.obstacles = [
            new Obstacle(this.blockSize, this.padding, 'left', 0),
            new Obstacle(this.blockSize, this.padding, 'right', 1),
            new Obstacle(this.blockSize, this.padding, 'left', 2),
            new Obstacle(this.blockSize, this.padding, 'right', 3),
        ];
    }

    draw = (alive) => {
        this.obstacles.forEach(obstacle => obstacle.draw(alive));
    }

    loadJSON = (serializedObject) => {
        let instance = new Obstacles(0, 0);
        Object.assign(instance, serializedObject);
        instance.obstacles = [];
        let obstacle = new Obstacle(0, 0, 'left', 0);
        for (let i = 0; i < serializedObject.obstacles.length; i++) {
            instance.obstacles.push(obstacle.loadJSON(serializedObject.obstacles[i]));
        }
        instance.reset();
        return instance;
    }

    reset = () => {
        this.obstacles = [
            new Obstacle(this.blockSize, this.padding, 'left', 0),
            new Obstacle(this.blockSize, this.padding, 'right', 1),
            new Obstacle(this.blockSize, this.padding, 'left', 2),
            new Obstacle(this.blockSize, this.padding, 'right', 3),
        ];
    }
}

class Obstacle {
    speed = 1.2;
    constructor(blockSize, padding, dirX, topOffset) {
        this.blockSize = blockSize;
        this.padding = padding;
        this.direction = dirX;
        this.radius = blockSize / 4;
        this.x = 0 + padding + this.blockSize * 6 + this.blockSize / 2;
        this.y = 0 + padding + this.blockSize * 1 + this.blockSize * topOffset + this.blockSize / 2;
        this.startX = this.x;
        this.endX = this.x + this.blockSize * 7;
        if (this.direction === "right") {
            this.x += this.blockSize * 7;
        }
    }
    draw = (alive) => {
        stroke(0);
        strokeWeight(2);
        fill('#0100FE');
        circle(this.x, this.y, 2 * this.radius);
        if (alive) this.move();
    }
    move = () => {
        if (this.direction === "right") {
            this.x -= this.speed;
        } else if (this.direction === "left") {
            this.x += this.speed;
        }
        if (this.x <= this.startX) {
            this.direction = "left";
        }
        if (this.x >= this.endX) {
            this.direction = "right";
        }
    }

    loadJSON = (serializedObject) => {
        let instance = new Obstacle(0, 0, 'left', 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}