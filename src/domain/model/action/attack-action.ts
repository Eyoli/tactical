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
        return distance <= this.srcUnitState.getUnit().getWeapon().getRange();
    }

    apply(): UnitState[] {
        throw new Error("Method not implemented.");
    }
}