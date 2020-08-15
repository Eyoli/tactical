import UnitState from "../unit-state";

export default interface Action {

    validate(): boolean;
    
    apply(): UnitState[];
}