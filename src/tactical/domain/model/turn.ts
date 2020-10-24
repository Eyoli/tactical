import Unit from "./unit";
import UnitState from "./unit-state";

export default class Turn {
    readonly unit: Readonly<Unit>;
    private readonly states: Map<string, UnitState[]>;
    private readonly changes: string[][];

    constructor(unit: Readonly<Unit>) {
        this.unit = unit;
        this.states = new Map();
        this.changes = [];
    }

    private getOrInitStates(unitId: string): UnitState[] {
        let unitStates = this.states.get(unitId);
        if (!unitStates) {
            unitStates = [];
            this.states.set(unitId, unitStates);
        }
        return unitStates;
    }

    getUnitState(unitId: string): UnitState {
        const unitStates = this.getOrInitStates(unitId);
        return unitStates[0];
    }

    getAllStates(): UnitState[] {
        return Array.from(this.states.values())
            .map(unitStates => unitStates[0]);
    }

    getFinalStates(): UnitState[] {
        return Array.from(this.states.values())
            .map(unitStates => {
                if (unitStates[0].unit.id === this.unit.id) {
                    return unitStates[0].toNextTurn();
                }
                return unitStates[0];
            });
    }

    integrate(saveStateChanges: boolean, newStates: UnitState[]): void {
        if (saveStateChanges) {
            this.changes.unshift(newStates.map(state => state.unit.id));
        }

        newStates.forEach(newState => {
            const unitStates = this.getOrInitStates(newState.unit.id);
            unitStates.unshift(newState);
        });
    }

    rollbackLastAction(): void {
        const lastActionChanges = this.changes.shift();
        if (lastActionChanges) {
            lastActionChanges
                .map(unitId => this.getOrInitStates(unitId))
                .forEach(currentTurnUnitStates => currentTurnUnitStates.shift());
        }
    }
}