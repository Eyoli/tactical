import Position from "./position";
import { Graph } from "./path/graph";

export default abstract class Field implements Graph<Position> {
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

    getNodeKey(p: Position): string {
        return p.hashCode().toString();
    }
    
    distanceBetween(p1: Position, p2: Position): number {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return dx*dx + dy*dy;
    }

    abstract costBetween(p: Position, neighbour: Position): number;

    abstract isValidPosition(p: Position): boolean;

    abstract getHeightDifference(p1: Position, p2: Position): number;
}

