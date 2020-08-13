import Field from "../../domain/model/field";
import Position from "../../domain/model/position";

export default class FakeField extends Field {

    constructor(name: string) {
        super(name);
    }

    getNeighbours(p: Position): Position[] {
        return [];
    }

    getCost(p: Position): number {
        return 1;
    }

    isValidPosition(p: Position): boolean {
        return true;
    }

    isNeighbourAccessible(p1: Position, p2: Position, moves: number, jumps: number): boolean {
        return true;
    }

    getHeightDifference(p1: Position, p2: Position): number {
        return 0;
    }
}