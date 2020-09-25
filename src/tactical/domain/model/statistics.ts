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

    withMoves(moves: number): Statistics {
        this.moves = moves;
        return this;
    }

    withJumps(jumps: number): Statistics {
        this.jumps = jumps;
        return this;
    }

    withHealth(health: number): Statistics {
        this.health = health;
        return this;
    }

    withSpeed(speed: number): Statistics {
        this.speed = speed;
        return this;
    }

    copy(): Statistics {
        const statistics = new Statistics();
        statistics.health = this.health;
        statistics.spirit = this.spirit;
        statistics.strength = this.strength;
        statistics.defense = this.defense;
        statistics.mind = this.mind;
        statistics.resistance = this.resistance;
        statistics.speed = this.speed;
        statistics.jumps = this.jumps;
        statistics.moves = this.moves;
        return statistics;
    }
}