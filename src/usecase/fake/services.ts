import { MovementServicePort } from "../../domain/port/primary/services";
import Field from "../../domain/model/field";
import Position from "../../domain/model/position";
import UnitState from "../../domain/model/unit-state";

export class FakeMovementService implements MovementServicePort {

    getAccessiblePositions(field: Field, unitState: UnitState): Position[] {
        return [];
    }

    isAccessible(field: Field | undefined, unit: UnitState, p: Position): boolean {
        return true;
    }
}