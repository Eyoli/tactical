import { ValueObject, hash } from "immutable";

export default class Position implements ValueObject {
    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    flatDistanceTo(p: Position): number {
        return Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    equals(other: any): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    hashCode(): number {
        return hash(JSON.stringify(this));
    }
}