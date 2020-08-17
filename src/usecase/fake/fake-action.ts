import Action from "../../tactical/domain/model/action/action";
import UnitState from "../../tactical/domain/model/unit-state";
import Position from "../../tactical/domain/model/position";

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
        return [new UnitState.Builder()
            .fromState(this.unitState)
            .movingTo(new Position(1,1))
            .build()];
    }

}