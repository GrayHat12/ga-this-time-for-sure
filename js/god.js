class God {
    constructor(blockSize, padding, starting_population = 100) {
        this.blockSize = blockSize;
        this.padding = padding;
        this.population_size = starting_population;

        this.DEATH_PERCENTAGE = 0.1;

        this.PREV_AVG_FITNESS = 0;

        this.fitness_sum = 0;
        this.GENERATION = 1;
        this.best_player = 0;
        this.frame = 0;

        this.startZone = new StartZone(blockSize, padding);
        this.startPath = new StartPath(blockSize, padding);
        this.midAlley = new MidAlley(blockSize, padding);
        this.endPath = new EndPath(blockSize, padding);
        this.endZone = new EndZone(blockSize, padding);

        this.startzonestartpathjoiner = new StartZoneStartPathJoiner(blockSize, padding);
        this.startpathmidalleyjoiner = new StartPathMidAlleyJoiner(blockSize, padding);
        this.midalleyendpathjoiner = new MidAlleyEndPathJoiner(blockSize, padding);
        this.endpathendzonejoiner = new EndPathEndZoneJoiner(blockSize, padding);

        this.setup();
    }

    setup = () => {

        console.log("Setting up God...");

        this.population = [new Piece(this.blockSize, this.padding)];
        this.obstacles = new Obstacles(blockSize, padding);

        for (let i = 1; i < this.population_size; i++) {
            this.population.push(new Piece(this.blockSize, this.padding));
        }

        for (let i = 0; i < this.population.length; i++) {
            this.population[i].zones.push(this.startZone);
            this.population[i].zones.push(this.startPath);
            this.population[i].zones.push(this.midAlley);
            this.population[i].zones.push(this.endPath);
            this.population[i].zones.push(this.endZone);

            this.population[i].zones.push(this.startzonestartpathjoiner);
            this.population[i].zones.push(this.startpathmidalleyjoiner);
            this.population[i].zones.push(this.midalleyendpathjoiner);
            this.population[i].zones.push(this.endpathendzonejoiner);
        }

        this.GAME_ENDED = false;
        this.displayInfo();
    }

    draw = () => {
        //this.findBestPlayer();
        this.startZone.draw();
        this.startPath.draw();
        this.midAlley.draw();
        this.endPath.draw();
        this.endZone.draw();

        this.obstacles.draw(!this.GAME_ENDED);

        this.detectFinish();

        for (let i = this.population.length - 1; i >= 0; i--) {
            if (!this.GAME_ENDED && this.population[i].alive && !this.hasReachedEnd(this.population[i])) {
                this.population[i].move();
                this.detectCollisions(this.population[i]);
            }
            //if (this.population[i].alive && i !== this.best_player) {
            //if (this.population[i].alive) {
            this.population[i].draw(false, this.fitness_sum / this.population.length);
            //}
        }

        /*if (this.population[this.best_player].alive) {
            this.population[this.best_player].draw(true);
        }*/

        if (this.GAME_ENDED) {
            this.onFinish();
        }

        if (this.frame++ % 100 === 0) {
            //console.log(this.countAlivePlayers(),this.population.length);
            //this.calculateFitness();
            this.calculateFitness();
            this.calculateFitnessSum();
            //this.displayInfo();
        }
    }

    hasReachedEnd = (piece) => {
        return this.endZone.isInsideZone(piece.x, piece.y, piece.width, piece.height);
    }

    findBestPlayer = () => {
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness > this.population[this.best_player].fitness) {
                this.best_player = i;
            }
        }
    }

    findWorstPlayer = () => {
        let worst_player = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness < this.population[worst_player].fitness) {
                worst_player = i;
            }
        }
        return worst_player;
    }

    detectFinish = () => {
        let displayed = false;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].alive && (!this.endZone.isInsideZone(this.population[i].x, this.population[i].y, this.population[i].width, this.population[i].height))) {
                return;
            }
            if (!this.population[i].alive && !displayed) {
                this.displayInfo();
                displayed = true;
            }
        }
        this.GAME_ENDED = true;
    }

    calculateFitness = () => {
        this.population.forEach((piece) => {
            piece.calculateFitness();
        });
    }

    onFinish = () => {
        this.calculateFitness();
        this.calculateFitnessSum();
        this.PREV_AVG_FITNESS = this.fitness_sum / this.population.length;
        this.naturalSelection();
        this.mutateTheBabies();
        this.GAME_ENDED = false;
        this.GENERATION++;
        this.displayInfo();
        this.frame = 0;
    }

    naturalSelection = () => {

        this.population = this.population.sort((a, b) => {
            return b.fitness - a.fitness;
        });

        let nextGeneration = [
            this.population[0].gimmeBaby()
        ];

        nextGeneration[0].isBest = true;

        //console.log(this.population[0].fitness - this.population[1].fitness);
        //let deaths = Math.floor(this.DEATH_PERCENTAGE * this.population.length);
        for (let i = 1; i < this.population.length; i++) {
            /*if (this.GENERATION > 0 && this.GENERATION % 5 === 0) {
                if (i >= (this.population.length - deaths)) {
                    let baby = new Piece(this.blockSize, this.padding);

                    baby.zones.push(this.startZone);
                    baby.zones.push(this.startPath);
                    baby.zones.push(this.midAlley);
                    baby.zones.push(this.endPath);
                    baby.zones.push(this.endZone);

                    baby.zones.push(this.startzonestartpathjoiner);
                    baby.zones.push(this.startpathmidalleyjoiner);
                    baby.zones.push(this.midalleyendpathjoiner);
                    baby.zones.push(this.endpathendzonejoiner);

                    nextGeneration.push(baby);
                    continue;
                }
            }*/
            // select parent based on fitness
            let parent = this.selectParent();

            // get baby from them
            let baby = parent.gimmeBaby();

            nextGeneration.push(baby);
        }

        this.population = [];

        this.population = nextGeneration;
    }

    calculateFitnessSum = () => {
        let fitnessSum = 0;
        for (let i = 0; i < this.population.length; i++) {
            fitnessSum += this.population[i].fitness;
        }
        this.fitness_sum = fitnessSum;
    }

    selectParent = () => {
        let randomValue = Math.random() * this.fitness_sum;
        let runningSum = 0;

        for (let i = 0; i < this.population.length; i++) {
            runningSum += this.population[i].fitness;
            if (runningSum > randomValue) {
                return this.population[i];
            }
        }
        console.log(this, runningSum, this.population, this.fitness_sum, randomValue);
        // should not reach this
        throw Error("Something went wrong");
    }

    mutateTheBabies = () => {
        for (let i = 1; i < this.population.length; i++) {
            this.population[i].brain.mutate();
        }
    }

    countAlivePlayers = () => {
        let count = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].alive) count += 1;
        }
        return count;
    }

    displayInfo = () => {
        let div = document.getElementById('info');
        div.innerHTML = `
        <strong>Generation ${this.GENERATION}</strong>
        <br />
        <span>Population : ${this.population.length}</span>
        <br />
        <span>PREV AVG FITNESS : ${this.PREV_AVG_FITNESS}</span>
        <br />
        <span>Alive : ${this.countAlivePlayers()}</span>
        `;
    }

    detectCollisions = (piece) => {
        let hasCollided = false;
        for (let i = 0; i < this.obstacles.obstacles.length; i++) {
            let obstacle = this.obstacles.obstacles[i];
            let distance = dist(piece.x + piece.width / 2, piece.y + piece.width / 2, obstacle.x, obstacle.y);
            if (distance < ((piece.width / 2) + obstacle.radius)) {
                hasCollided = true;
                piece.alive = false;
                break;
            }
        }
        return hasCollided;
    }
}