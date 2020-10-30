export default class Statistics {

    private constructor(
        readonly health = 0,
        readonly spirit = 0,
        readonly strength = 0,
        readonly defense = 0,
        readonly mind = 0,
        readonly resistance = 0,
        readonly speed = 0,
        readonly jumps = 0,
        readonly moves = 0) {
    }

    static Builder = class Builder {
        private health?: number;
        private spirit?: number;
        private strength?: number;
        private defense?: number;
        private mind?: number;
        private resistance?: number;
        private speed?: number;
        private jumps?: number;
        private moves?: number;

        withMoves(moves: number): Builder {
            this.moves = moves;
            return this;
        }

        withJumps(jumps: number): Builder {
            this.jumps = jumps;
            return this;
        }

        withHealth(health: number): Builder {
            this.health = health;
            return this;
        }

        withSpeed(speed: number): Builder {
            this.speed = speed;
            return this;
        }

        build(): Statistics {
            return new Statistics(
                this.health,
                this.spirit,
                this.strength,
                this.defense,
                this.mind,
                this.resistance,
                this.speed,
                this.jumps,
                this.moves
            );
        }
    }
}