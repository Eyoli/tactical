import Unit from "./unit";
import Position from "./position";

/**
 * Represent a given state of a unit 
 */
export default class UnitState {
    private unitId!: string;
    private position!: Position;
    private jumps!: number;
    private moves!: number;
    private moved!: boolean;

    getUnitId(): string {
        return this.unitId;
    }

    getJumps(): number {
        return this.jumps;
    }

    getMoves(): number {
        return this.moves;
    }

    getPosition(): Position {
        return this.position;
    }

    hasMoved(): boolean {
        return this.moved;
    }

    private constructor() {}

    static Builder = class Builder {
        private unitState: UnitState;

        constructor() {
            this.unitState = new UnitState();
        }
    
        init(unit: Unit, p: Position): Builder {
            this.unitState.unitId = unit.id;
            this.unitState.moved = false;
            this.unitState.position = p;
            this.unitState.jumps = unit.jumps;
            this.unitState.moves = unit.moves;
            return this;
        }
    
        fromState(state: UnitState): Builder {
            this.unitState.unitId = state.unitId;
            this.unitState.moved = state.moved;
            this.unitState.jumps = state.jumps;
            this.unitState.moves = state.moves;
            return this;
        }
    
        toNextTurn(): Builder {
            this.unitState.moved = false;
            return this;
        }
    
        movingTo(p: Position): Builder {
            this.unitState.position = p;
            this.unitState.moved = true;
            return this;
        }
    
        build(): UnitState {
            return this.unitState;
        }
    }
}