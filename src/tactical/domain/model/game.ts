import Field from "./field/field";
import Player from "./player";
import Unit from "./unit";
import UnitState from "./unit-state";
import TurnManager from "./turn-manager";
import Position from "./position";
import { GameState } from "./enums";

export default class Game {
    id!: string;
    field!: Field<Position>;
    private turnManager!: TurnManager;

    static Builder = class Builder {
        private id?: string;
        private field?: Field<Position>;
        private players?: Player[];
        private state?: GameState;

        withId(id: string): Builder {
            this.id = id;
            return this;
        }

        withField(field: Field<Position>): Builder {
            this.field = field;
            return this;
        }

        withPlayers(...players: Player[]): Builder {
            this.players = players;
            return this;
        }

        started(): Builder {
            this.state = GameState.STARTED;
            return this;
        }

        build(): Game {
            return new Game(this.state, this.players);
        }
    }

    private constructor(
        private state: GameState = GameState.INITIATED,
        readonly players: Player[] = [],
        private readonly units: Map<string, Unit> = new Map(),
        private readonly unitsPerPlayer: Map<string, string[]> = new Map()) {
    }

    addPlayers(...players: Player[]): void {
        this.players.push(...players);
    }

    setUnits(player: Player, units: Unit[]): void {
        if (player.id) {
            this.unitsPerPlayer.set(player.id, units.map(unit => unit.id));
            units.forEach(unit => {
                this.units.set(unit.id, unit);
            });
        }
    }

    getUnits(player: Player): Unit[] {
        const units = this.unitsPerPlayer.get(player.id)
            ?.map(unitId => this.getUnit(unitId));
        if (!units) {
            return [];
        }
        return units;
    }

    getUnit(unitId: string): Unit {
        return this.units.get(unitId)!;
    }

    getCurrentUnit(): Readonly<Unit> | undefined {
        if (this.hasStarted()) {
            return this.turnManager.get().unit;
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
        }
    }

    canMove(unit: Unit): boolean {
        if (this.hasStarted()) {
            const unitState = this.getUnitState(unit.id);
            return unitState.moved === false
                && this.turnManager.get().unit.id === unit.id;
        }
        return false;
    }

    canAct(unit: Unit): boolean {
        if (this.hasStarted()) {
            const unitState = this.getUnitState(unit.id);
            return unitState.acted === false
                && this.turnManager.get().unit.id === unit.id;
        }
        return false;
    }

    findUnitState(p: Position): UnitState | undefined {
        return this.turnManager.get().getAllStates()
            .find(unitState => unitState.position.equals(p));
    }

    getUnitState(unitId: string): UnitState {
        return this.turnManager.get().getUnitState(unitId);
    }

    getAllStates(): UnitState[] {
        return this.turnManager.get().getAllStates();
    }

    integrate(saveStateChanges: boolean, ...newStates: UnitState[]): void {
        this.turnManager.get().integrate(saveStateChanges, newStates);
    }

    rollbackLastAction(): void {
        this.turnManager.get().rollbackLastAction();
    }
}
