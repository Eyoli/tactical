import { FieldAlgorithmServicePort } from "../../tactical/domain/port/primary/services";
import Field from "../../tactical/domain/model/field";
import Position from "../../tactical/domain/model/position";
import UnitState from "../../tactical/domain/model/unit-state";
import { ActionType, Range } from "../../tactical/domain/model/action/action-type";

export class FakeFieldAlgorithmService implements FieldAlgorithmServicePort {

    getShortestPath(field: Field, position: Position, p: Position, jumps: number): Position[] {
        return [];
    }
    private positions?: Position[];

    withPositionsInRange(positions: Position[]) {
        this.positions = positions;
    }
    
    getPositionsInRange(field: Field, position: Position, range: Range): Position[] {
        return this.positions || [];
    }

    getAccessiblePositions(field: Field, unitState: UnitState): Position[] {
        return [];
    }

    isAccessible(field: Field | undefined, unit: UnitState, p: Position): boolean {
        return true;
    }
}