import Tile from "./tile-based-field/tile";
import Position from "./position";
import UnitState from "./unit-state";

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

    abstract isNeighbourAccessible(p1: Position, p2: Position, moves: number, jumps: number): boolean;

    abstract getHeightDifference(p1: Position, p2: Position): number;
}

