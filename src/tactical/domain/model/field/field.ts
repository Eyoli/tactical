import { Graph } from "../path/graph";
import { ValueObject } from "immutable";

export default abstract class Field<T extends ValueObject> implements Graph<T> {
    id!: string;
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    withId(id: string): Field<T> {
        this.id = id;
        return this;
    }

    abstract getNeighbours(p: T): T[];

    getNodeKey(p: T): string {
        return p.hashCode().toString();
    }
    
    abstract distanceBetween(p1: T, p2: T): number;

    abstract costBetween(p: T, neighbour: T): number;

    abstract isValidPosition(p: T): boolean;

    abstract getHeightDifference(p1: T, p2: T): number;
}

