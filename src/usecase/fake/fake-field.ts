import Field from "../../tactical/domain/model/field";
import Position from "../../tactical/domain/model/position";
import UnitState from "../../tactical/domain/model/unit-state";

export default class FakeField extends Field {
    private validPositions: boolean;

    constructor(name: string, validPositions: boolean = true) {
        super(name);
        this.validPositions = validPositions;
    }

    getNeighbours(p: Position): Position[] {
        return [];
    }

    getCost(p: Position): number {
        return 1;
    }

    isValidPosition(p: Position): boolean {
        return this.validPositions;
    }

    isNeighbourAccessible(p1: Position, p2: Position, moves: number, jumps: number): boolean {
        return true;
    }

    getHeightDifference(p1: Position, p2: Position): number {
        return 0;
    }
}