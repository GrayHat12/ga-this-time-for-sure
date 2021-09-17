class Piece {
    movement = 1.4;
    alive = true;
    zones = [];
    
    constructor(blockSize, padding) {
        this.blockSize = blockSize;
        this.padding = padding;
        this.width = blockSize / 2;
        this.height = blockSize / 2;
        this.x = (0 + this.padding + this.blockSize * 4) / 2 - this.width / 2;
        this.y = (0 + this.padding + this.blockSize * 6) / 2 - this.height / 2;
    }

    draw = () => {
        stroke(0);
        strokeWeight(1);
        fill('red');
        rect(this.x, this.y, this.width, this.height);
    }

    moveUp = () => {
        let y = this.y - this.movement;
        let ensured = false;
        for(let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isInsideZone(this.x,y,this.width,this.height)) {
                ensured = true;
                break;
            }
        }
        if (ensured) this.y = y;
    }

    moveDown = () => {
        let y = this.y + this.movement;
        let ensured = false;
        for(let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isInsideZone(this.x,y,this.width,this.height)) {
                ensured = true;
                break;
            }
        }
        if (ensured) this.y = y;
    }

    moveRight = () => {
        let x = this.x + this.movement;
        let ensured = false;
        for(let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isInsideZone(x,this.y,this.width,this.height)) {
                ensured = true;
                break;
            }
        }
        if (ensured) this.x = x;
    }

    moveLeft = () => {
        let x = this.x - this.movement;
        let ensured = false;
        for(let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isInsideZone(x,this.y,this.width,this.height)) {
                ensured = true;
                break;
            }
        }
        if (ensured) this.x = x;
    }
}