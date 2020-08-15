import { ValueObject, hash } from "immutable";

export default class Position implements ValueObject {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceTo(p: Position): number {
        return Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y));
    }

    equals(other: any): boolean {
        return this.x === other.x && this.y === other.y;
    }

    hashCode(): number {
        return hash(JSON.stringify(this));
    }
}