import Field from "../../tactical/domain/model/field/field";
import Position from "../../tactical/domain/model/position";

export default class FakeField extends Field<Position> {
    private validPositions: boolean;

    constructor(name: string, validPositions = true) {
        super(name);
        this.validPositions = validPositions;
    }

    getNeighbours(p: Position): Position[] {
        return [];
    }

    costBetween(p: Position, neighbour: Position): number {
        return 1;
    }

    isValidPosition(p: Position): boolean {
        return this.validPositions;
    }

    getHeightDifference(p1: Position, p2: Position): number {
        return 0;
    }

    distanceBetween(p1: Position, p2: Position): number {
        return 0;
    }
}