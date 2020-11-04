import Field from "./field/field";
import Player from "./player";
import Unit from "./unit";
import UnitState from "./unit-state";
import TurnManager from "./turn-manager";
import Position from "./position";
import { GameState } from "./enums";
import { Goal } from "./goal";

export default class Game {

    static Builder = class Builder {
        private id?: string;
        private field?: Field<Position>;
        private players?: Player[];
        private state?: GameState;
        private readonly units: Map<string, Unit> = new Map();
        private readonly unitsPerPlayer: Map<string, string[]> = new Map();
        private readonly goalsPerPlayer: Map<string, Goal[]> = new Map();

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

        withGoals(player: Player, ...goals: Goal[]): Builder {
            this.goalsPerPlayer.set(player.id, goals);
            return this;
        }

        withUnit(player: Player, unit: Unit): Builder {
            this.units.set(unit.id, unit);
            let playerUnits = this.unitsPerPlayer.get(player.id);
            if (!playerUnits) {
                playerUnits = [];
                this.unitsPerPlayer.set(player.id, playerUnits);
            }
            playerUnits.push(unit.id);
            return this;
        }

        build(): Game {
            return new Game(
                this.state,
                this.players,
                this.goalsPerPlayer,
                this.units,
                this.unitsPerPlayer);
        }
    }

    id!: string;
    field!: Field<Position>;
    private turnManager!: TurnManager;
    winner?: Player;

    private constructor(
        private state: GameState = GameState.INITIATED,
        readonly players: Player[] = [],
        private readonly goalsPerPlayer: Map<string, Goal[]> = new Map(),
        private readonly units: Map<string, Unit> = new Map(),
        private readonly unitsPerPlayer: Map<string, string[]> = new Map()) {
    }

    addPlayers(...players: Player[]): void {
        this.players.push(...players);
    }

    addGoal(player: Player, goal: Goal): void {
        let playerGoals = this.goalsPerPlayer.get(player.id);
        if (!playerGoals) {
            playerGoals = [];
            this.goalsPerPlayer.set(player.id, playerGoals);
        }
        playerGoals.push(goal);
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
        if (this.started()) {
            return this.turnManager.get().unit;
        }
    }

    getState(): string {
        return this.state;
    }

    start(turnManager: TurnManager): Game {
        this.state = GameState.STARTED;
        this.turnManager = turnManager;
        this.turnManager.init(Array.from(this.units.values()));
        return this;
    }

    started(): boolean {
        return this.state === GameState.STARTED;
    }

    finished(): boolean {
        return this.state === GameState.FINISHED;
    }

    finishTurn(): void {
        if (this.started()) {
            this.turnManager.next();
        }
    }

    canMove(unit: Unit): boolean {
        if (this.started()) {
            const unitState = this.getUnitState(unit.id);
            return unitState.moved === false
                && this.turnManager.get().unit.id === unit.id;
        }
        return false;
    }

    canAct(unit: Unit): boolean {
        if (this.started()) {
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

    integrate(saveStateChanges: boolean, ...newStates: UnitState[]): Game {
        this.turnManager.get().integrate(saveStateChanges, newStates);
        if (saveStateChanges) {
            this.winner = this.determineWinner();
            if (this.winner) {
                this.state = GameState.FINISHED;
            }
        }
        return this;
    }

    rollbackLastAction(): void {
        this.turnManager.get().rollbackLastAction();
    }

    private determineWinner(): Player | undefined {
        return this.players
            .find(player => this.goalsPerPlayer.get(player.id)?.every(goal => goal.reached(this)));
    }
}
