import Field from "./field/field";
import Player from "./player";
import Unit from "./unit";
import UnitState from "./unit-state";
import TurnManager from "./turn-manager";
import Position from "./position";
import { GameState } from "./enums";

class Turn {
    readonly states: Map<string, UnitState[]>;
    readonly changes: string[][];

    constructor(states?: Map<string, UnitState[]>) {
        this.states = states || new Map();
        this.changes = [];
    }

    getUnitState(unitId: string): UnitState {
        const unitStates = this.states.get(unitId)!;
        return unitStates[0];
    }

    integrate(saveStateChanges: boolean, newStates: UnitState[]): void {
        if (saveStateChanges) {
            this.changes.unshift(newStates.map(state => state.unit.id));
        }

        newStates.forEach(newState => {
            const unitStates = this.states.get(newState.unit.id);
            if (unitStates) {
                unitStates.unshift(newState);
            }
        });
    }

    rollbackLastAction(): void {
        const lastActionChanges = this.changes.shift();
        if (lastActionChanges) {
            lastActionChanges
                .map(unitId => this.states.get(unitId))
                .forEach(currentTurnUnitStates => currentTurnUnitStates?.shift());
        }
    }
}

export default class Game {
    id!: string;
    field!: Field<Position>;
    players: Player[];
    private units: Map<string, Unit>;
    private unitsPerPlayer: Map<string, string[]>;
    private state: GameState;
    private turnManager!: TurnManager;
    private currentTurn: Turn;

    constructor() {
        this.state = GameState.INITIATED;
        this.players = [];
        this.units = new Map();
        this.unitsPerPlayer = new Map();
        this.currentTurn = new Turn();
    }

    addPlayers(...players: Player[]): void {
        this.players.push(...players);
    }

    setUnits(player: Player, units: Unit[]): void {
        if (player.id) {
            this.unitsPerPlayer.set(player.id, units.map(unit => unit.id));
            units.forEach(unit => {
                this.units.set(unit.id, unit);
                this.currentTurn.states.set(unit.id, []);
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

    getCurrentUnit(): Unit | undefined {
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

            // keep only the last state of the turn for each unit
            const unitStates = this.currentTurn.states.get(this.getCurrentUnit()!.id);
            const lastState = unitStates?.shift();
            if (lastState) {
                unitStates?.splice(0);
                unitStates?.unshift(lastState.toNextTurn());
            }

            // clean turn changes
            this.currentTurn = new Turn(this.currentTurn.states);
        }
    }

    canMove(unit: Unit): boolean {
        if (this.hasStarted()) {
            const unitState = this.getUnitState(unit.id);
            return unitState.moved === false
                && this.turnManager.getCurrentUnit().id === unit.id;
        }
        return false;
    }

    canAct(unit: Unit): boolean {
        if (this.hasStarted()) {
            const unitState = this.getUnitState(unit.id);
            return unitState.acted === false
                && this.turnManager.getCurrentUnit().id === unit.id;
        }
        return false;
    }

    findUnitState(p: Position): UnitState | undefined {
        return this.getAllStates()
            .find(unitState => unitState.position.equals(p));
    }

    getUnitState(unitId: string): UnitState {
        return this.currentTurn.getUnitState(unitId);
    }

    getAllStates(): UnitState[] {
        return Array.from(this.units.keys())
            .map(unitId => this.currentTurn.getUnitState(unitId));
    }

    integrate(saveStateChanges: boolean, ...newStates: UnitState[]): void {
        this.currentTurn.integrate(saveStateChanges, newStates);
    }

    rollbackLastAction(): void {
        this.currentTurn.rollbackLastAction();
    }
}
