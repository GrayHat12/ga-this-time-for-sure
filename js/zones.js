class Zone {
    static IDENTIFIER = "zone";
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

    loadJSON = (serializedObject) => {
        let instance;
        switch (serializedObject.IDENTIFIER) {
            case Zone.IDENTIFIER: {
                instance = new Zone(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case StartZone.IDENTIFIER: {
                instance = new StartZone(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case StartPath.IDENTIFIER: {
                instance = new StartPath(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case MidAlley.IDENTIFIER: {
                instance = new MidAlley(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case EndPath.IDENTIFIER: {
                instance = new EndPath(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case EndZone.IDENTIFIER: {
                instance = new EndZone(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case StartZoneStartPathJoiner.IDENTIFIER: {
                instance = new StartZoneStartPathJoiner(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case StartPathMidAlleyJoiner.IDENTIFIER: {
                instance = new StartPathMidAlleyJoiner(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case MidAlleyEndPathJoiner.IDENTIFIER: {
                instance = new MidAlleyEndPathJoiner(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case EndPathEndZoneJoiner.IDENTIFIER: {
                instance = new EndPathEndZoneJoiner(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case PathZone.IDENTIFIER: {
                instance = new PathZone(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case StartZonePathZoneJoiner.IDENTIFIER: {
                instance = new StartZonePathZoneJoiner(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            case AltPathEndZoneJoiner.IDENTIFIER: {
                instance = new AltPathEndZoneJoiner(0, 0);
                Object.assign(instance, serializedObject);
                break;
            };
            default: {
                console.error("Unknown Zone type: " + serializedObject);
                break;
            }
        }
        return instance;
    }
}

class StartZone extends Zone {
    static IDENTIFIER = "startzone";
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

    loadJSON = (serializedObject) => {
        let instance = new StartZone(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class StartPath extends Zone {
    static IDENTIFIER = "startpath";
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

    loadJSON = (serializedObject) => {
        let instance = new StartPath(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class MidAlley extends Zone {
    static IDENTIFIER = "midalley";
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

    loadJSON = (serializedObject) => {
        let instance = new MidAlley(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class EndPath extends Zone {
    static IDENTIFIER = "endpath";
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

    loadJSON = (serializedObject) => {
        let instance = new EndPath(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class EndZone extends Zone {
    static IDENTIFIER = "endzone";
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

    loadJSON = (serializedObject) => {
        let instance = new EndZone(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class StartZoneStartPathJoiner extends Zone {
    static IDENTIFIER = "StartZoneStartPathJoiner".toLowerCase();
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 3;
        this.y = 0 + padding + this.blockSize * 5;
        this.width = this.blockSize * 2;
        this.height = this.blockSize * 1;
    }

    loadJSON = (serializedObject) => {
        let instance = new StartZoneStartPathJoiner(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class StartPathMidAlleyJoiner extends Zone {
    static IDENTIFIER = "StartPathMidAlleyJoiner".toLowerCase();
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 5;
        this.y = 0 + padding + this.blockSize * 4;
        this.width = this.blockSize * 1;
        this.height = this.blockSize * 2;
    }

    loadJSON = (serializedObject) => {
        let instance = new StartPathMidAlleyJoiner(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class MidAlleyEndPathJoiner extends Zone {
    static IDENTIFIER = "MidAlleyEndPathJoiner".toLowerCase();
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 14;
        this.y = 0 + padding + this.blockSize * 0;
        this.width = this.blockSize * 1;
        this.height = this.blockSize * 2;
    }

    loadJSON = (serializedObject) => {
        let instance = new MidAlleyEndPathJoiner(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class EndPathEndZoneJoiner extends Zone {
    static IDENTIFIER = "EndPathEndZoneJoiner".toLowerCase();
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 15;
        this.y = 0 + padding + this.blockSize * 0;
        this.width = this.blockSize * 2;
        this.height = this.blockSize * 1;
    }

    loadJSON = (serializedObject) => {
        let instance = new EndPathEndZoneJoiner(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class PathZone extends Zone {
    static IDENTIFIER = "pathzone";
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 4;
        this.y = 0 + padding + this.blockSize * 0;
        this.width = this.blockSize * 12;
        this.height = this.blockSize * 6;
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

    loadJSON = (serializedObject) => {
        let instance = new PathZone(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class StartZonePathZoneJoiner extends Zone {
    static IDENTIFIER = "StartZonePathZoneJoiner".toLowerCase();
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 3;
        this.y = 0 + padding + this.blockSize * 0;
        this.width = this.blockSize * 2;
        this.height = this.blockSize * 6;
    }
    loadJSON = (serializedObject) => {
        let instance = new StartZonePathZoneJoiner(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}

class AltPathEndZoneJoiner extends Zone {
    static IDENTIFIER = "AltPathEndZoneJoiner".toLowerCase();
    constructor(blockSize, padding) {
        super(blockSize, padding);
        this.x = 0 + padding + this.blockSize * 15;
        this.y = 0 + padding + this.blockSize * 0;
        this.width = this.blockSize * 2;
        this.height = this.blockSize * 6;
    }
    loadJSON = (serializedObject) => {
        let instance = new AltPathEndZoneJoiner(0, 0);
        Object.assign(instance, serializedObject);
        return instance;
    }
}