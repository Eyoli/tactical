import { ActionType } from "../../tactical/domain/model/action/action-type";
import Position from "../../tactical/domain/model/position";

export default class ActionInfoDTO {
    actionType: ActionType;
    positions: Position[];

    constructor(actionType: ActionType, positions: Position[]) {
        this.actionType = actionType;
        this.positions = positions;
    }
}