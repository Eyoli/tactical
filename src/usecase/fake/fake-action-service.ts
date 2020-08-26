import { ActionServicePort } from "../../tactical/domain/port/primary/services";
import UnitState from "../../tactical/domain/model/unit-state";
import Action from "../../tactical/domain/model/action/action";
import FakeAction from "./fake-action";
import { ActionType, RangeType, TargetType } from "../../tactical/domain/model/action/action-type";

export default class FakeActionService implements ActionServicePort {
    
    getActionType(id: string): ActionType {
        return new ActionType("attack", TargetType.UNIT, RangeType.WEAPON);
    }

    generateActionOnTarget(actionType: ActionType, srcUnitState: UnitState, targetUnitState: UnitState): Action {
        return new FakeAction().withUnitState(targetUnitState);
    }
}