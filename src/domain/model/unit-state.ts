import Unit from "./unit";
import Position from "./position";

/**
 * Represent a given state of a unit 
 */
export default class UnitState {
    position!: Position;
    jumps: number;
    moves: number;

    constructor(unit: Unit) {
        this.moves = unit.moves;
        this.jumps = unit.jumps;
    }

    withPosition(position: Position) {
        this.position = position;
        return this;
    }
}