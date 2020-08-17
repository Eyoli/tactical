import { MovementServicePort } from "../../tactical/domain/port/primary/services";
import Field from "../../tactical/domain/model/field";
import Position from "../../tactical/domain/model/position";
import UnitState from "../../tactical/domain/model/unit-state";

export class FakeMovementService implements MovementServicePort {

    getAccessiblePositions(field: Field, unitState: UnitState): Position[] {
        return [];
    }

    isAccessible(field: Field | undefined, unit: UnitState, p: Position): boolean {
        return true;
    }
}