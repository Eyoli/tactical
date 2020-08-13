import Tile from "./tile";
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

    abstract getTopTile(p: Position): Tile;

    abstract isValidPosition(p: Position): boolean;

    abstract isNeighbourAccessible(p1: Position, p2: Position, moves: number, jumps: number): boolean;

    abstract getHeightDifference(p1: Position, p2: Position): number;
}

