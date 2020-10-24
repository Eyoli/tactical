import Turn from "./turn";
import Unit from "./unit";

export default class TurnManager {
    private currentTurnUnitIndex: number;
    private units: Unit[];
    private turn: Turn;

    constructor(units: Unit[]) {
        this.units = units.sort((u1, u2) => u2.statistics.speed - u1.statistics.speed);
        this.currentTurnUnitIndex = 0;
        this.turn = new Turn(this.getCurrentUnit());
    }

    private getCurrentUnit(): Unit {
        return this.units[this.currentTurnUnitIndex];
    }

    get(): Turn {
        return this.turn;
    }

    next(): void {
        // get the last state of the turn for each unit
        const finalStates = this.turn.getFinalStates();

        // init new turn
        this.currentTurnUnitIndex = (this.currentTurnUnitIndex + 1) % this.units.length;
        this.turn = new Turn(this.getCurrentUnit());
        this.turn.integrate(false, finalStates);
    }
}