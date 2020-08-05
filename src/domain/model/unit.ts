export default class Unit {
    id?: string;
    name: string;
    moves!: number;
    jumps!: number;

    constructor(name: string) {
        this.name = name;
    }

    withMoves(moves: number) {
        this.moves = moves;
        return this;
    }

    withJumps(jumps: number) {
        this.jumps = jumps;
        return this;
    }
}