import { ActionServicePort } from "../../domain/port/primary/services";
import UnitState from "../../domain/model/unit-state";
import Action from "../../domain/model/action/action";
import { ActionType } from "../../domain/model/action/action-type";
import { injectable } from "inversify";
import AttackAction from "../../domain/model/action/attack-action";

@injectable()
export default class ActionService implements ActionServicePort {

    generateActionOnTarget(srcUnitState: UnitState, targetUnitState: UnitState, actionType: ActionType): Action {
        switch (actionType) {
            case ActionType.ATTACK:
                return  new AttackAction(srcUnitState, targetUnitState);
            default:
                throw new Error("action not implemented");
        }
    }
}