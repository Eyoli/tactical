import { ActionServicePort } from "../../tactical/domain/port/primary/services";
import UnitState from "../../tactical/domain/model/unit-state";
import Action from "../../tactical/domain/model/action/action";
import FakeAction from "./fake-action";

export default class FakeActionService implements ActionServicePort {

    generateActionOnTarget(srcUnitState: UnitState, targetUnitState: UnitState, type: string): Action {
        return new FakeAction().withUnitState(targetUnitState);
    }
}