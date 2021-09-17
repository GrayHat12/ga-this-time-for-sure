class Zone {
    constructor(blockSize, padding) {
        this.blockSize = blockSize;
        this.padding = padding;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    isInsideZone = (x, y, width, height) => {
        if (x >= this.x) {
            if (y >= this.y) {
                if ((x + width) <= (this.x + this.width)) {
                    if ((y + height) <= (this.y + this.height)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    light = (...args) => {
        console.log(this, args);
    }
}

class StartZone extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding;
        this.y = 0 + padding;
        this.width = this.blockSize * 4;
        this.height = this.blockSize * 6;
    }

    draw = () => {
        noStroke();
        fill('#B6FEB4');
        rect(this.x, this.y, this.width, this.height);
    }
}

class StartPath extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 4;
        this.y = 0 + padding + this.blockSize * 5;
        this.width = this.blockSize * 2;
        this.height = this.blockSize * 1;
    }

    draw = () => {
        let colours = ["#F7F7FF", "#E6E6FF"];
        noStroke();
        let index = 0;
        for (let i = this.y; i < this.y + this.height; i += this.blockSize) {
            for (let j = this.x; j < this.x + this.width; j += this.blockSize) {
                let colour = colours[index];
                if (index == 1) index = 0;
                else index = 1;
                fill(colour);
                rect(j, i, this.blockSize, this.blockSize);
            }
            if (index == 1) index = 0;
            else index = 1;
        }
    }
}

class MidAlley extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 5;
        this.y = 0 + padding + this.blockSize * 1;
        this.width = this.blockSize * 10;
        this.height = this.blockSize * 4;
    }

    draw = () => {
        let colours = ["#E6E6FF", "#F7F7FF"];
        let index = 0;
        noStroke();
        for (let i = this.y; i < this.y + this.height; i += this.blockSize) {
            for (let j = this.x; j < this.x + this.width; j += this.blockSize) {
                let colour = colours[index];
                if (index == 1) index = 0;
                else index = 1;
                fill(colour);
                rect(j, i, this.blockSize, this.blockSize);
            }
            if (index == 1) index = 0;
            else index = 1;
        }
    }
}

class EndPath extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 14;
        this.y = 0 + padding + this.blockSize * 0;
        this.width = this.blockSize * 2;
        this.height = this.blockSize * 1;
    }

    draw = () => {
        let colours = ["#E6E6FF", "#F7F7FF"];
        noStroke();
        let index = 0;
        for (let i = this.y; i < this.y + this.height; i += this.blockSize) {
            for (let j = this.x; j < this.x + this.width; j += this.blockSize) {
                let colour = colours[index];
                if (index == 1) index = 0;
                else index = 1;
                fill(colour);
                rect(j, i, this.blockSize, this.blockSize);
            }
            if (index == 1) index = 0;
            else index = 1;
        }
    }
}

class EndZone extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 16;
        this.y = 0 + padding;
        this.width = this.blockSize * 4;
        this.height = this.blockSize * 6;
    }

    draw = () => {
        noStroke();
        fill('#B6FEB4');
        rect(this.x, this.y, this.width, this.height);
    }
}

class StartZoneStartPathJoiner extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 3;
        this.y = 0 + padding + this.blockSize * 5;
        this.width = this.blockSize * 2;
        this.height = this.blockSize * 1;
    }
}

class StartPathMidAlleyJoiner extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 5;
        this.y = 0 + padding + this.blockSize * 4;
        this.width = this.blockSize * 1;
        this.height = this.blockSize * 2;
    }
}

class MidAlleyEndPathJoiner extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 14;
        this.y = 0 + padding + this.blockSize * 0;
        this.width = this.blockSize * 1;
        this.height = this.blockSize * 2;
    }
}

class EndPathEndZoneJoiner extends Zone {
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 15;
        this.y = 0 + padding + this.blockSize * 0;
        this.width = this.blockSize * 2;
        this.height = this.blockSize * 1;
    }
}