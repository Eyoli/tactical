import { ActionServicePort } from "../../domain/port/primary/services";
import UnitState from "../../domain/model/unit-state";
import Action from "../../domain/model/action/action";
import { ActionType } from "../../domain/model/action/action-type";
import { injectable, inject } from "inversify";
import AttackAction from "../../domain/model/action/attack-action";
import RepositoryPort from "../../domain/port/secondary/repository-port";
import { TYPES } from "../../../types";
import ResourceNotFoundError from "../../domain/model/error/resource-not-found-error";

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

    generateActionOnTarget(actionTypeId: string, srcUnitState: UnitState, targetUnitState: UnitState): Action {
        const actionType = this.getActionType(actionTypeId);
        switch (actionTypeId) {
            case "attack":
                return new AttackAction(actionType, srcUnitState, targetUnitState);
            default:
                throw new Error("Action found but not managed");
        }
    }
}