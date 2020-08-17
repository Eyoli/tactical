import Field from "./field";
import Player from "./player";
import Unit from "./unit";
import UnitState from "./unit-state";

export const enum GameState {
    INITIATED = "INITIATED", 
    STARTED = "STARTED", 
    FINISHED = "FINISHED"
}

export default class Game {
    id!: string;
    field?: Field;
    players: Player[];
    private units: Map<string, Unit>;
    private unitsPerPlayer: Map<string, string[]>;
    private state: GameState;

    private currentTurnPlayerIndex: number;
    private currentTurnStates: Map<string, UnitState[]>;
    private currentTurnChanges: string[][];

    constructor() {
        this.state = GameState.INITIATED;
        this.players = [];
        this.units = new Map();
        this.unitsPerPlayer = new Map();

        this.currentTurnStates = new Map();
        this.currentTurnChanges = [];
        this.currentTurnPlayerIndex = 0;
    }

    addPlayers(...players: Player[]) {
        this.players.push(...players);
    }

    setUnits(player: Player, units: Unit[]) {
        if(player.id) {
            this.unitsPerPlayer.set(player.id, units.map(unit => unit.id));
            units.forEach(unit => {
                this.units.set(unit.id, unit);
                this.currentTurnStates.set(unit.id, []);
            });
        }
    }

    getUnits(player: Player): Unit[] {
        const units = this.unitsPerPlayer.get(player.id)
            ?.map(unitId => this.units.get(unitId)!);
        if(!units) {
            return [];
        }
        return units;
    }

    getUnit(unitId: string): Unit {
        return this.units.get(unitId)!;
    }

    getCurrentPlayer(): Player | undefined {
        if(this.hasStarted()) {
            return this.players[this.currentTurnPlayerIndex];
        }
    }

    getState(): string {
        return this.state;
    }

    start(): void {
        this.state = GameState.STARTED;
    }

    hasStarted(): boolean {
        return this.state === GameState.STARTED;
    }

    finishTurn(): void {
        if(this.hasStarted()) {
            this.currentTurnPlayerIndex = (this.currentTurnPlayerIndex + 1) % this.players.length;
        }
    }

    canMove(unit: Unit): boolean {
        if(this.hasStarted()) {
            const unitState = this.getUnitState(unit.id);
            const player = this.getCurrentPlayer();
            return unitState.hasMoved() === false && this.getUnits(player!)
                .map(u => u.id)
                .includes(unit.id);
        }
        return false;
    }

    canAct(unit: Unit): boolean {
        if(this.hasStarted()) {
            const unitState = this.getUnitState(unit.id);
            const player = this.getCurrentPlayer();
            return unitState.hasActed() === false && this.getUnits(player!)
                .map(u => u.id)
                .includes(unit.id);
        }
        return false;
    }

    getUnitState(unitId: string): UnitState {
        const states = this.currentTurnStates.get(unitId)!;
        return states[0];
    }

    integrate(saveStateChanges: boolean, ...newStates: UnitState[]): void {
        if (saveStateChanges) {
            this.currentTurnChanges.unshift(newStates.map(state => state.getUnit().id));
        }
        
        newStates.forEach(newState => {
            const states = this.currentTurnStates.get(newState.getUnit().id);
            if (states) {
                states.unshift(newState);
            }
        });
    }

    rollbackLastAction(): void {
        const lastActionChanges = this.currentTurnChanges.shift();
        if (lastActionChanges) {
            lastActionChanges
                .map(unitId => this.currentTurnStates.get(unitId))
                .forEach(currentTurnUnitStates => currentTurnUnitStates?.shift());
        }
    }
}