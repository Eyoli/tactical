import Action from "./action";
import UnitState from "../unit-state";
import { ActionType, Range } from "./action-type";

export default class AttackAction implements Action {
    private srcUnitState: UnitState;
    private targetUnitState: UnitState;
    private actionType: ActionType;
    private range: Range;

    constructor(actionType: ActionType, srcUnitState: UnitState, targetUnitState: UnitState) {
        this.actionType = actionType;
        this.srcUnitState = srcUnitState;
        this.targetUnitState = targetUnitState;
        this.range = this.actionType.range || this.srcUnitState.unit.getWeapon().range;
    }

    validate(): boolean {
        
        const distance = this.srcUnitState.position.flatDistanceTo(this.targetUnitState.position);
        return distance <= this.range.max
            && distance >= this.range.min;
    }

    apply(): UnitState[] {
        if (this.actionType.damage) {
            return [
                this.srcUnitState,
                this.targetUnitState.damaged(this.actionType.damage)
            ];
        }
        return [
            this.srcUnitState,
            this.targetUnitState.damaged(this.srcUnitState.computeWeaponDamage())
        ];
    }
}