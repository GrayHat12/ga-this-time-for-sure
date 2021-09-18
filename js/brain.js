class Brain {
    constructor(size) {
        this.size = size;
        this.possibleDirections = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1] /*,[0, -1] */, [1, -1]];
        this.step = 0;
        this.directions = [];
        this.randomize();
        this.learntmoves = {};
    }

    randomize = () => {
        //let directions = [0, 1, 2, 3, 4, 5, 6, 7];
        let _randomised = []
        for (let i = 0; i < this.size; i++) {
            //let randomVerticalDirection = directions[Math.floor(Math.random() * directions.length)];
            //let randomHorizontalDirection = directions[Math.floor(Math.random() * directions.length)];
            let randomDirection = this.possibleDirections[Math.floor(Math.random() * this.possibleDirections.length)];
            _randomised.push(randomDirection);
        }
        this.directions = _randomised;
    }

    getMove = (x, y, obstacles) => {
        let _obstacles = [];
        for (let i = 0; i < obstacles.length; i++) {
            let direction = obstacles[i].direction;
            _obstacles.push(direction);
        }
        let key = `${x},${y},${_obstacles.join(',')}}`;
        let move = this.learntmoves[key];
        if (!move) {
            move = this.getRandomMove();
            this.learntmoves[key] = move;
        }
        return move;
    }

    getKey = (x, y, obstacles) => {
        let _obstacles = [];
        for (let i = 0; i < obstacles.length; i++) {
            let direction = obstacles[i].direction;
            _obstacles.push(direction);
        }
        let key = `${x},${y},${_obstacles.join(',')}}`;
        return key;
    }

    getRandomMove = () => {
        return this.possibleDirections[Math.floor(Math.random() * this.possibleDirections.length)];
    }

    clone = () => {
        let clone = new Brain(this.size);
        clone.directions = [...this.directions];
        clone.learntmoves = { ...this.learntmoves };
        clone.step = 0;
        return clone;
    }

    mutate = (index, size) => {
        const MUTATION_RATE = 0.01;
        let mutationRate = 1 / size;
        let keys = Object.keys(this.learntmoves);
        //mutationRate = Math.min(MUTATION_RATE * index, MUTATION_RATE);
        mutationRate = MUTATION_RATE;
        for (let i = 0; i < this.directions.length; i++) {
            //for (let i = 0; i < keys.length; i++) {
            let rand = Math.random();
            if (rand < mutationRate) {
                // set this to a random direction
                let randomDirection = this.getRandomMove();
                while (randomDirection === this.directions[i]) randomDirection = this.getRandomMove();
                this.directions[i] = randomDirection;
                //this.learntmoves[keys[i]] = randomDirection;
            }
        }
    }

    loadJSON = (serializedObject) => {
        let instance = new Brain(0);
        if (this.size > serializedObject.size) {
            instance.directions = [...serializedObject.directions,...(new Brain(this.size - serializedObject.size)).directions];
        }else if (this.size < serializedObject.size) {
            instance.directions = [...serializedObject.directions.slice(0, this.size)];
        }else {
            instance.directions = [...serializedObject.directions];
        }
        instance.size = this.size;
        return instance;
    }
}


//give it 8 directions of movement
//   1-1 10 11
// 0-1 _\|/_ 01
//      /|\
// -1-1 -10 -11