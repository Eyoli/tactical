import Action from "./action";
import UnitState from "../unit-state";
import { ActionType } from "./action-type";

export default class AttackAction implements Action {
    private srcUnitState: UnitState;
    private targetUnitState: UnitState;
    private actionType: ActionType;

    constructor(actionType: ActionType, srcUnitState: UnitState, targetUnitState: UnitState) {
        this.actionType = actionType;
        this.srcUnitState = srcUnitState;
        this.targetUnitState = targetUnitState;
    }

    validate(): boolean {
        const distance = this.srcUnitState.getPosition().distanceTo(this.targetUnitState.getPosition());
        return distance <= this.srcUnitState.getUnit().getWeapon().range.max
            && distance >= this.srcUnitState.getUnit().getWeapon().range.min;
    }

    apply(): UnitState[] {
        return [
            this.srcUnitState,
            this.targetUnitState.damaged(this.srcUnitState.computeWeaponDamage())
        ];
    }
}