export default class Statistics {
    health = 0;
    spirit = 0;
    strength = 0;
    defense = 0;
    mind = 0;
    resistance = 0;
    speed = 0;
    jumps = 0;
    moves = 0;

    private constructor() {
        //
    }

    static Builder = class Builder {
        private object = new Statistics();

        withMoves(moves: number): Builder {
            this.object.moves = moves;
            return this;
        }

        withJumps(jumps: number): Builder {
            this.object.jumps = jumps;
            return this;
        }

        withHealth(health: number): Builder {
            this.object.health = health;
            return this;
        }

        withSpeed(speed: number): Builder {
            this.object.speed = speed;
            return this;
        }

        build(): Statistics {
            return this.object;
        }
    }
}