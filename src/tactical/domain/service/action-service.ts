import { ActionServicePort } from "../port/primary/services";
import UnitState from "../model/unit-state";
import Action from "../model/action/action";
import { ActionType } from "../model/action/action-type";
import { injectable, inject } from "inversify";
import AttackAction from "../model/action/attack-action";
import RepositoryPort from "../port/secondary/repository-port";
import { TYPES } from "../../../types";
import ResourceNotFoundError from "../model/error/resource-not-found-error";

@injectable()
export default class ActionService implements ActionServicePort {
    private actionTypeRepository: RepositoryPort<ActionType>;

    constructor(@inject(TYPES.ACTION_TYPE_REPOSITORY) actionTypeRepository: RepositoryPort<ActionType>) {
        this.actionTypeRepository = actionTypeRepository;
    }

    getActionType(id: string): ActionType {
        const actionType = this.actionTypeRepository.load(id);
        if (!actionType) {
            throw ResourceNotFoundError.fromClass(ActionType);
        }
        return actionType;
    }

    generateAction(actionType: ActionType, srcUnitState: UnitState, targetUnitState: UnitState): Action {
        switch (actionType.id) {
            case "attack":
            case "fireball":
                return new AttackAction(actionType, srcUnitState, targetUnitState);
            default:
                throw new Error("Action found but not managed");
        }
    }
}