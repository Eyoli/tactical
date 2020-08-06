import { ValueObject, hash } from "immutable";

export default class Position implements ValueObject {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other: any): boolean {
        return this.x === other.x && this.y === other.y;
    }

    hashCode(): number {
        return hash(JSON.stringify(this));
    }
}