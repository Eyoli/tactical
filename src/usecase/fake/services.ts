import { FieldAlgorithmServicePort } from "../../tactical/domain/port/primary/services";
import Field from "../../tactical/domain/model/field";
import Position from "../../tactical/domain/model/position";
import UnitState from "../../tactical/domain/model/unit-state";
import { ActionType } from "../../tactical/domain/model/action/action-type";

export class FakeFieldAlgorithmService implements FieldAlgorithmServicePort {

    getPositionsInRange(field: Field, unitState: UnitState, actionType: ActionType): Position[] {
        return [];
    }

    getAccessiblePositions(field: Field, unitState: UnitState): Position[] {
        return [];
    }

    isAccessible(field: Field | undefined, unit: UnitState, p: Position): boolean {
        return true;
    }
}