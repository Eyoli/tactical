import Unit from "./unit";

export default class TurnManager {
    private currentTurnUnitIndex: number;
    private units: Unit[];

    constructor(units: Unit[]) {
        this.units = units.sort((u1, u2) => u2.getStatistics().speed - u1.getStatistics().speed);
        this.currentTurnUnitIndex = 0;
    }

    getCurrentUnit(): Unit {
        return this.units[this.currentTurnUnitIndex];
    }

    next(): void {
        this.currentTurnUnitIndex = (this.currentTurnUnitIndex + 1) % this.units.length;
    }
}