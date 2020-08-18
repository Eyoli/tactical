import Action from "./action";
import UnitState from "../unit-state";

export default class AttackAction implements Action {
    private srcUnitState: UnitState;
    private targetUnitState: UnitState;

    constructor(srcUnitState: UnitState, targetUnitState: UnitState) {
        this.srcUnitState = srcUnitState;
        this.targetUnitState = targetUnitState;
    }

    validate(): boolean {
        const distance = this.srcUnitState.getPosition().distanceTo(this.targetUnitState.getPosition());
        return distance <= this.srcUnitState.getUnit().getWeapon().rangeMax
            && distance >= this.srcUnitState.getUnit().getWeapon().rangeMin;
    }

    apply(): UnitState[] {
        return [
            this.targetUnitState.damaged(this.srcUnitState.computeWeaponDamage())
        ];
    }
}