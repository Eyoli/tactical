import Field from "./field";
import Player from "./player";
import Unit from "./unit";
import UnitState from "./unit-state";
import TurnManager from "./turn-manager";
import Position from "./position";

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
    private turnManager!: TurnManager;

    private currentTurnStates: Map<string, UnitState[]>;
    private currentTurnChanges: string[][];

    constructor() {
        this.state = GameState.INITIATED;
        this.players = [];
        this.units = new Map();
        this.unitsPerPlayer = new Map();

        this.currentTurnStates = new Map();
        this.currentTurnChanges = [];
    }

    addPlayers(...players: Player[]) {
        this.players.push(...players);
    }

    setUnits(player: Player, units: Unit[]) {
        if (player.id) {
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
        if (!units) {
            return [];
        }
        return units;
    }

    getUnit(unitId: string): Unit {
        return this.units.get(unitId)!;
    }

    getCurrentUnit() {
        if (this.hasStarted()) {
            return this.turnManager.getCurrentUnit();
        }
    }

    getState(): string {
        return this.state;
    }

    start(): void {
        this.state = GameState.STARTED;
        this.turnManager = new TurnManager(Array.from(this.units.values()));
    }

    hasStarted(): boolean {
        return this.state === GameState.STARTED;
    }

    finishTurn(): void {
        if (this.hasStarted()) {
            this.turnManager.next();

            const unitStates = this.currentTurnStates.get(this.getCurrentUnit()!.id)!
            const lastState = unitStates.shift()!;
            unitStates.splice(0);
            unitStates.unshift(lastState.toNextTurn());
        }
    }

    canMove(unit: Unit): boolean {
        if (this.hasStarted()) {
            const unitState = this.getUnitState(unit.id);
            return unitState.hasMoved() === false
                && this.turnManager.getCurrentUnit().id === unit.id;
        }
        return false;
    }

    canAct(unit: Unit): boolean {
        if (this.hasStarted()) {
            const unitState = this.getUnitState(unit.id);
            return unitState.hasActed() === false
                && this.turnManager.getCurrentUnit().id === unit.id;
        }
        return false;
    }

    findUnitState(p: Position) {
        return this.getUnitStates()
            .find(unitState => unitState.getPosition().equals(p));
    }

    getUnitState(unitId: string): UnitState {
        const states = this.currentTurnStates.get(unitId)!;
        return states[0];
    }

    getUnitStates(): UnitState[] {
        return Array.from(this.currentTurnStates.values())
            .map(unitStates => unitStates[0]);
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
                .map(unitId => this.currentTurnStates.get(unitId)!)
                .forEach(currentTurnUnitStates => currentTurnUnitStates.shift());
        }
    }
}