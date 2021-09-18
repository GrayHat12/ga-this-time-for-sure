class God {
    constructor(blockSize, padding, starting_population = 200) {
        this.blockSize = blockSize;
        this.padding = padding;
        this.population_size = starting_population;

        this.DEATH_PERCENTAGE = 0.02;

        this.showDEAD = true;

        this.PREV_AVG_FITNESS = 0;

        this.fitness_sum = 0;
        this.showBEST = false;
        this.GENERATION = 1;
        this.best_player = 0;
        this.frame = 0;

        this.startZone = new StartZone(blockSize, padding);
        this.startPath = new StartPath(blockSize, padding);
        this.midAlley = new MidAlley(blockSize, padding);
        this.endPath = new EndPath(blockSize, padding);
        this.endZone = new EndZone(blockSize, padding);

        this.altPath = new PathZone(blockSize, padding);
        this.startzonealtpathjoiner = new StartZonePathZoneJoiner(blockSize, padding);
        this.altpathendzonejoiner = new AltPathEndZoneJoiner(blockSize, padding);

        this.startzonestartpathjoiner = new StartZoneStartPathJoiner(blockSize, padding);
        this.startpathmidalleyjoiner = new StartPathMidAlleyJoiner(blockSize, padding);
        this.midalleyendpathjoiner = new MidAlleyEndPathJoiner(blockSize, padding);
        this.endpathendzonejoiner = new EndPathEndZoneJoiner(blockSize, padding);

        this.setup();
    }

    loadJSON = (serializedObject) => {
        let instance = new God(0, 0, 200);
        Object.assign(instance, serializedObject);

        instance.altPath = new PathZone(instance.blockSize, instance.padding);
        instance.altPath = instance.altPath.loadJSON(serializedObject.altPath);

        instance.altpathendzonejoiner = new AltPathEndZoneJoiner(instance.blockSize, instance.padding);
        instance.altpathendzonejoiner = instance.altpathendzonejoiner.loadJSON(serializedObject.altpathendzonejoiner);

        instance.endPath = new EndPath(instance.blockSize, instance.padding);
        instance.endPath = instance.endPath.loadJSON(serializedObject.endPath);

        instance.endZone = new EndZone(instance.blockSize, instance.padding);
        instance.endZone = instance.endZone.loadJSON(serializedObject.endZone);

        instance.endpathendzonejoiner = new EndPathEndZoneJoiner(instance.blockSize, instance.padding);
        instance.endpathendzonejoiner = instance.endpathendzonejoiner.loadJSON(serializedObject.endpathendzonejoiner);

        instance.midAlley = new MidAlley(instance.blockSize, instance.padding);
        instance.midAlley = instance.midAlley.loadJSON(serializedObject.midAlley);

        instance.midalleyendpathjoiner = new MidAlleyEndPathJoiner(instance.blockSize, instance.padding);
        instance.midalleyendpathjoiner = instance.midalleyendpathjoiner.loadJSON(serializedObject.midalleyendpathjoiner);

        instance.startPath = new StartPath(instance.blockSize, instance.padding);
        instance.startPath = instance.startPath.loadJSON(serializedObject.startPath);

        instance.startZone = new StartZone(instance.blockSize, instance.padding);
        instance.startZone = instance.startZone.loadJSON(serializedObject.startZone);

        instance.startpathmidalleyjoiner = new StartPathMidAlleyJoiner(instance.blockSize, instance.padding);
        instance.startpathmidalleyjoiner = instance.startpathmidalleyjoiner.loadJSON(serializedObject.startpathmidalleyjoiner);

        instance.startzonestartpathjoiner = new StartZoneStartPathJoiner(instance.blockSize, instance.padding);
        instance.startzonestartpathjoiner = instance.startzonestartpathjoiner.loadJSON(serializedObject.startzonestartpathjoiner);

        instance.obstacles = new Obstacles(instance.blockSize, instance.padding);
        instance.obstacles = instance.obstacles.loadJSON(serializedObject.obstacles);

        instance.startzonealtpathjoiner = new StartZonePathZoneJoiner(instance.blockSize, instance.padding);
        instance.startzonealtpathjoiner = instance.startzonealtpathjoiner.loadJSON(serializedObject.startzonealtpathjoiner);

        instance.population = [];

        let piece = new Piece(0, 0);
        for (let i = 0; i < serializedObject.population.length; i++) {
            let _p = piece.loadJSON(serializedObject.population[i]);
            _p.zones = [];
            _p.zones.push(instance.startZone);
            _p.zones.push(instance.startPath);
            _p.zones.push(instance.midAlley);
            _p.zones.push(instance.endPath);
            _p.zones.push(instance.endZone);

            _p.zones.push(instance.startzonestartpathjoiner);
            _p.zones.push(instance.startpathmidalleyjoiner);
            _p.zones.push(instance.midalleyendpathjoiner);
            _p.zones.push(instance.endpathendzonejoiner);

            instance.population.push(_p);
        }

        return instance;
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
            //this.population[i].zones.push(this.altPath);
            this.population[i].zones.push(this.endZone);
            //this.population[i].zones.push(this.startzonealtpathjoiner);
            //this.population[i].zones.push(this.altpathendzonejoiner);

            this.population[i].zones.push(this.startPath);
            this.population[i].zones.push(this.midAlley);
            this.population[i].zones.push(this.endPath);
            //this.population[i].zones.push(this.endZone);

            this.population[i].zones.push(this.startzonestartpathjoiner);
            this.population[i].zones.push(this.startpathmidalleyjoiner);
            this.population[i].zones.push(this.midalleyendpathjoiner);
            this.population[i].zones.push(this.endpathendzonejoiner);
        }

        this.GAME_ENDED = false;
        this.displayInfo();
    }

    draw = () => {
        this.findBestPlayer();
        this.startZone.draw();
        this.startPath.draw();
        this.midAlley.draw();
        this.endPath.draw();
        this.endZone.draw();

        //this.altPath.draw();

        this.obstacles.draw(!this.GAME_ENDED);

        this.detectFinish();

        for (let i = this.population.length - 1; i >= 0; i--) {

            let isBestPlayer = i === this.best_player;
            let avg_fitness = this.fitness_sum / this.population.length;
            let reached_goal = this.hasReachedEnd(this.population[i]);

            if (!this.GAME_ENDED && this.population[i].alive && !reached_goal) {

                this.population[i].move(this.obstacles.obstacles);
                this.detectCollisions(this.population[i]);
            }
            //if (this.population[i].alive && i !== this.best_player) {
            //if (this.population[i].alive) {
            if (this.population[i].alive) {

                if (this.showBEST && (i === this.best_player || this.population[i].isBest)) this.population[i].draw(isBestPlayer, avg_fitness, reached_goal);
                else if (!this.showBEST) this.population[i].draw(isBestPlayer, avg_fitness, reached_goal);
            }
            else if (this.showDEAD) this.population[i].draw(isBestPlayer, avg_fitness, reached_goal);
            //}
        }

        /*if (this.population[this.best_player].alive) {
            this.population[this.best_player].draw(true);
        }*/

        if (this.GAME_ENDED) {
            this.onFinish();
        }

        //if (this.frame++ % 100 === 0) {
        //console.log(this.countAlivePlayers(),this.population.length);
        //this.calculateFitness();
        this.calculateFitness();
        this.calculateFitnessSum();
        //this.displayInfo();
        //}
    }

    hasReachedEnd = (piece) => {
        let end = this.endZone.isInsideZone(piece.x, piece.y, piece.width, piece.height);
        //if (end) console.log("Reached end!");
        return end;
    }

    findBestPlayer = () => {
        this.best_player = 0;
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
                //this.displayInfo();
                displayed = true;
            }
        }
        this.GAME_ENDED = true;
    }

    calculateFitness = () => {
        this.population.forEach((piece) => {
            piece.calculateFitness(this.endZone, this.startZone);
        });
    }

    onFinish = () => {
        this.calculateFitness();
        this.calculateFitnessSum();
        console.log(this.population[this.best_player].brain.step);
        this.PREV_AVG_FITNESS = this.fitness_sum / this.population.length;
        this.naturalSelection();
        this.mutateTheBabies();
        this.GAME_ENDED = false;
        this.GENERATION++;
        this.displayInfo();
        this.obstacles.reset();
        this.frame = 0;
    }

    naturalSelection = () => {

        let nextGeneration = [];

        //console.log(this.population[0].fitness - this.population[1].fitness);
        let deaths = Math.floor(this.DEATH_PERCENTAGE * this.population.length);
        for (let i = 1; i < this.population.length; i++) {
            let chance = Math.random();
            if (this.GENERATION > 0 && this.GENERATION % 5 === 0) {
                if (i >= (this.population.length - deaths)) {
                    let newbaby = new Piece(this.blockSize, this.padding);

                    newbaby.zones.push(this.startZone);
                    newbaby.zones.push(this.startPath);
                    newbaby.zones.push(this.midAlley);
                    newbaby.zones.push(this.endPath);
                    newbaby.zones.push(this.endZone);
                    //newbaby.zones.push(this.startzonealtpathjoiner);
                    //newbaby.zones.push(this.altpathendzonejoiner);

                    newbaby.zones.push(this.startzonestartpathjoiner);

                    newbaby.zones.push(this.startzonestartpathjoiner);
                    newbaby.zones.push(this.startpathmidalleyjoiner);
                    newbaby.zones.push(this.midalleyendpathjoiner);
                    newbaby.zones.push(this.endpathendzonejoiner);

                    //newbaby.zones.push(this.altPath);

                    if (chance > 0.5) nextGeneration.push(newbaby);
                    else nextGeneration.push(this.population[0].gimmeBaby());
                    continue;
                }
            }
            // select parent based on fitness
            let parent = this.selectParent();

            // get baby from them
            let baby = parent.gimmeBaby();

            nextGeneration.push(baby);
        }

        this.population = this.population.sort((a, b) => {
            return b.fitness - a.fitness;
        });

        nextGeneration = [this.population[0].gimmeBaby(), ...nextGeneration];
        nextGeneration[0].isBest = true;

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
        let RATE = 0.4;
        for (let i = 1; i < this.population.length; i++) {
            if (Math.random() < RATE) this.population[i].brain.mutate(i, this.population.length);
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
                this.displayInfo();
                //piece.brain.step = piece.brain.directions.length;
                break;
            }
        }
        return hasCollided;
    }
}