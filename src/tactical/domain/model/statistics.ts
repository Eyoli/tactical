export default class Statistics {
    health: number = 0;
    spirit: number = 0;

    strength: number = 0;
    defense: number = 0;
    mind: number = 0;
    resistance: number = 0;
    speed: number = 0;

    jumps: number = 0;
    moves: number = 0;

    withMoves(moves: number): Statistics {
        this.moves = moves;
        return this;
    }

    withJumps(jumps: number): Statistics {
        this.jumps = jumps;
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