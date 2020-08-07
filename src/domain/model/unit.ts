export default class Unit {
    id!: string;
    name: string;
    moves!: number;
    jumps!: number;

    constructor(name: string) {
        this.name = name;
    }

    withId(id: string): Unit {
        this.id = id;
        return this;
    }

    withMoves(moves: number): Unit {
        this.moves = moves;
        return this;
    }

    withJumps(jumps: number): Unit {
        this.jumps = jumps;
        return this;
    }
}