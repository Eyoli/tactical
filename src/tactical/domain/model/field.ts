import Position from "./position";

export default abstract class Field {
    id!: string;
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    withId(id: string) {
        this.id = id;
        return this;
    }

    abstract getNeighbours(p: Position): Position[];

    abstract getCost(p: Position): number;

    abstract isValidPosition(p: Position): boolean;

    abstract getHeightDifference(p1: Position, p2: Position): number;
}

