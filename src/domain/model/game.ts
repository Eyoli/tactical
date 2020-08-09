import Field from "./field";
import Player from "./player";
import Unit from "./unit";
import { CreateGameRequest } from "../../api/request/requests";
import { UnitState } from "./unit-state";

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
    private unitStates: Map<string, UnitState[]>;

    constructor() {
        this.players = [];
        this.unitsPerPlayer = new Map<string,Unit[]>();
        this.unitStates = new Map<string, UnitState[]>();
        this.currentPlayerIndex = 0;
    }

    addPlayers(...players: Player[]) {
        this.players.push(...players);
    }

    setUnits(player: Player, units: Unit[]) {
        if(player.id) {
            this.unitsPerPlayer.set(player.id, units);
            units.forEach(unit => this.unitStates.set(unit.id, []));
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

    getUnitState(unit: Unit): UnitState | undefined {
        const states = this.unitStates.get(unit.id);
        if(states) {
            return states[0];
        }
        return undefined;
    }

    setUnitState(unit: Unit, newUnitState: UnitState) {
        const states = this.unitStates.get(unit.id);
        if(states) {
            states.unshift(newUnitState);
        }
    }
}