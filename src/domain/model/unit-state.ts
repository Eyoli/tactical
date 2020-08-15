import Unit from "./unit";
import Position from "./position";
import Statistics from "./statistics";
import { stat } from "fs";

/**
 * Represent a given state of a unit 
 */
export default class UnitState {
    private unit!: Unit;

    private statistics!: Statistics;
    private position!: Position;
    private health!: number;
    private spirit!: number;
    private moved: boolean = false;
    private acted: boolean = false;

    getUnit(): Unit {
        return this.unit;
    }

    getJumps(): number {
        return this.statistics.jumps;
    }

    getMoves(): number {
        return this.statistics.moves;
    }

    getPosition(): Position {
        return this.position;
    }

    hasMoved(): boolean {
        return this.moved;
    }

    hasActed(): boolean {
        return this.acted;
    }

    private constructor() {}

    static Builder = class Builder {
        private unitState: UnitState;

        constructor() {
            this.unitState = new UnitState();
        }
    
        init(unit: Unit, p: Position): Builder {
            this.unitState.unit = unit;
            this.unitState.position = p;
            return this;
        }
    
        fromState(previousState: UnitState): Builder {
            this.unitState.unit = previousState.unit;
            this.unitState.moved = previousState.moved;
            this.unitState.acted = previousState.acted;
            this.unitState.position = previousState.position;
            this.unitState.health = previousState.health;
            this.unitState.spirit = previousState.spirit;
            return this;
        }
    
        toNextTurn(): Builder {
            this.unitState.moved = false;
            this.unitState.acted = false;
            return this;
        }
    
        movingTo(p: Position): Builder {
            this.unitState.position = p;
            this.unitState.moved = true;
            return this;
        }

        acting(): Builder {
            this.unitState.acted = true;
            return this;
        }
    
        build(): UnitState {
            this.unitState.statistics = this.unitState.unit.getStatistics().copy();
            return this.unitState;
        }
    }
}