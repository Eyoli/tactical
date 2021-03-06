import Action from "../../tactical/domain/model/action/action";
import UnitState from "../../tactical/domain/model/unit-state";
import Position from "../../tactical/domain/model/position";
import { Damage, DamageType } from "../../tactical/domain/model/weapon";

export default class FakeAction implements Action {
    private unitState!: UnitState;

    withUnitState(srcUnitState: UnitState): FakeAction {
        this.unitState = srcUnitState;
        return this;
    }

    validate(): boolean {
        return true;
    }

    apply(): UnitState[] {
        return [
            this.unitState.damaged(new Damage(10, DamageType.CUTTING))
        ];
    }

}