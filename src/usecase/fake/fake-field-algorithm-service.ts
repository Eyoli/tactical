import { FieldAlgorithmServicePort } from "../../tactical/domain/port/primary/services";
import Field from "../../tactical/domain/model/field/field";
import Position from "../../tactical/domain/model/position";
import UnitState from "../../tactical/domain/model/unit-state";
import { Range } from "../../tactical/domain/model/action/action-type";

export class FakeFieldAlgorithmService implements FieldAlgorithmServicePort {

    getShortestPath(field: Field<Position>, position: Position, p: Position, jumps: number): Position[] {
        return [];
    }
    private positions?: Position[];

    withPositionsInRange(positions: Position[]) {
        this.positions = positions;
    }
    
    getPositionsInRange(field: Field<Position>, position: Position, range: Range): Position[] {
        return this.positions || [];
    }

    getAccessiblePositions(field: Field<Position>, unitState: UnitState): Position[] {
        return [];
    }

    isAccessible(field: Field<Position> | undefined, unit: UnitState, p: Position): boolean {
        return true;
    }
}