import { UnitState } from "../unit-state";
import Game from "../game";

export default interface Action {

    validate(): boolean;
    
    apply(): UnitState[];
}