import { ActionServicePort } from "../../tactical/domain/port/primary/services";
import UnitState from "../../tactical/domain/model/unit-state";
import Action from "../../tactical/domain/model/action/action";
import FakeAction from "./fake-action";

export default class FakeActionService implements ActionServicePort {

    generateActionOnTarget(actionTypeId: string, srcUnitState: UnitState, targetUnitState: UnitState): Action {
        return new FakeAction().withUnitState(targetUnitState);
    }
}