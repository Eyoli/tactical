import Field from "./field";
import Player from "./player";
import Unit from "./unit";
import { CreateGameRequest } from "../../api/request/requests";
import UnitState from "./unit-state";

enum GameState {
    INITIATED = "INITIATED", 
    STARTED = "STARTED", 
    FINISHED = "FINISHED"
}

export default class Game {
    id!: string;
    field?: Field;
    players: Player[];
    private unitsPerPlayer: Map<string, Unit[]>;
    private currentPlayerIndex: number;
    private state: GameState = GameState.INITIATED;

    private currentTurnStates: Map<string, UnitState[]>;
    private currentTurnChanges: string[][] = [];

    constructor() {
        this.players = [];
        this.unitsPerPlayer = new Map<string,Unit[]>();
        this.currentTurnStates = new Map<string, UnitState[]>();
        this.currentPlayerIndex = 0;
    }

    addPlayers(...players: Player[]) {
        this.players.push(...players);
    }

    setUnits(player: Player, units: Unit[]) {
        if(player.id) {
            this.unitsPerPlayer.set(player.id, units);
            units.forEach(unit => this.currentTurnStates.set(unit.id, []));
        }
    }

    getUnits(player: Player): Unit[] {
        const units = this.unitsPerPlayer.get(player.id);
        return units ? units : [];
    }

    getCurrentPlayer(): Player | undefined {
        if(this.hasStarted()) {
            return this.players[this.currentPlayerIndex];
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
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
    }

    canAct(unit: Unit): boolean {
        if(this.hasStarted()) {
            const unitState = this.getUnitState(unit);
            const player = this.getCurrentPlayer();
            return unitState?.hasMoved() === false && this.getUnits(player!)
                .map(u => u.id)
                .includes(unit.id);
        }
        return false;
    }

    getUnitState(unit: Unit): UnitState | undefined {
        const states = this.currentTurnStates.get(unit.id);
        if(states) {
            return states[0];
        }
        return undefined;
    }

    integrate(saveStateChanges: boolean, ...newStates: UnitState[]): void {
        if (saveStateChanges) {
            this.currentTurnChanges.unshift(newStates.map(state => state.getUnitId()));
        }
        
        newStates.forEach(newState => {
            const states = this.currentTurnStates.get(newState.getUnitId());
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