import Field from "../../tactical/domain/model/field";
import Position from "../../tactical/domain/model/position";
import UnitState from "../../tactical/domain/model/unit-state";

export default class FakeField extends Field {
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
}