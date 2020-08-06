import { IMovementService } from "../../domain/port/primary/services";
import Field from "../../domain/model/field";
import UnitState from "../../domain/model/unit-state";
import Position from "../../domain/model/position";

export class FakeMovementService implements IMovementService {

    getAccessiblePositions(field: Field, unitState: UnitState): Position[] {
        return [];
    }
}