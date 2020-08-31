import { ActionServicePort } from "../../tactical/domain/port/primary/services";
import UnitState from "../../tactical/domain/model/unit-state";
import Action from "../../tactical/domain/model/action/action";
import FakeAction from "./fake-action";
import { ActionType, TargetType, Range } from "../../tactical/domain/model/action/action-type";
import { Damage, DamageType } from "../../tactical/domain/model/weapon";

export default class FakeActionService implements ActionServicePort {
    private action!: Action;
    private actionType!: ActionType;

    withAction(action: Action): FakeActionService {
        this.action = action;
        return this;
    }

    withActionType(actionType: ActionType): FakeActionService {
        this.actionType = actionType;
        return this;
    }

    getActionType(id: string): ActionType {
        return this.actionType;
    }

    generateAction(actionType: ActionType, srcUnitState: UnitState, targetUnitState: UnitState): Action {
        return new FakeAction().withUnitState(targetUnitState);
    }
}