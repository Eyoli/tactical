import Unit from "./unit";
import Position from "./position";

/**
 * Represent a given state of a unit 
 */
class _UnitState {
    position!: Position;
    jumps!: number;
    moves!: number;
    hasMoved!: boolean;

    constructor() {
    }
}

type UnitState = Readonly<_UnitState>;

class UnitStateBuilder {
    private _unitState: _UnitState;

    constructor() {
        this._unitState = new _UnitState();
    }

    init(unit: Unit, p: Position): UnitStateBuilder {
        this._unitState.hasMoved = false;
        this._unitState.position = p;
        this._unitState.jumps = unit.jumps;
        this._unitState.moves = unit.moves;
        return this;
    }

    fromState(state: UnitState): UnitStateBuilder {
        this._unitState.hasMoved = state.hasMoved;
        this._unitState.jumps = state.jumps;
        this._unitState.moves = state.moves;
        return this;
    }

    toNextTurn(): UnitStateBuilder {
        this._unitState.hasMoved = false;
        return this;
    }

    movingTo(p: Position): UnitStateBuilder {
        this._unitState.position = p;
        this._unitState.hasMoved = true;
        return this;
    }

    build(): UnitState {
        return this._unitState;
    }
}

export { UnitStateBuilder, UnitState };