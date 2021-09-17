class Brain {
    constructor(size) {
        this.size = size;
        this.step = 0;
        this.directions = new Array(size).fill(0);
        this.randomize();
    }

    randomize = () => {
        let directions = [0, 1, 2, 3, 4, 5, 6, 7];
        for (let i = 0; i < this.size; i++) {
            let randomDirection = directions[Math.floor(Math.random() * directions.length)];
            this.directions[i] = randomDirection;
        }
    }

    clone = () => {
        let clone = new Brain(this.size);
        clone.directions = [...this.directions];
        clone.step = 0;
        return clone;
    }

    mutate = () => {
        let mutationRate = 0.01;
        for (let i = 0; i < this.directions.length; i++) {
            let rand = Math.random();
            if (rand < mutationRate) {
                // set this to a random direction
                let directions = [0, 1, 2, 3, 4, 5, 6, 7];
                let randomDirection = directions[Math.floor(Math.random() * directions.length)];
                this.directions[i] = randomDirection;
            }
        }
    }
}


//give it 8 directions of movement
//   7 0 1
//  6_\|/_ 2
//    /|\
//   5 4 3