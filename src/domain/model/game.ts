import Field from "./field";
import Player from "./player";
import Unit from "./unit";
import { CreateGameRequest } from "../port/primary/requests";
import UnitState from "./unit-state";

export default class Game {
    id?: string;
    field?: Field;
    players: Player[];
    private unitsPerPlayer: Map<string,Unit[]>;
    private currentPlayerIndex: number;
    private started = false;

    constructor() {
        this.players = [];
        this.unitsPerPlayer = new Map<string,Unit[]>();
        this.currentPlayerIndex = 0;
    }

    addPlayers(...players: Player[]) {
        this.players.push(...players);
    }

    setUnits(player: Player, units: Unit[]) {
        if(player.id) {
            this.unitsPerPlayer.set(player.id, units);
        }
    }

    getUnits(playerId: string): Unit[] {
        const units = this.unitsPerPlayer.get(playerId);
        return units ? units : [];
    }

    getCurrentPlayer(): Player | undefined {
        if(this.started) {
            return this.players[this.currentPlayerIndex];
        }
    }

    start(): void {
        this.started = true;
    }

    hasStarted(): boolean {
        return this.started;
    }

    finishTurn(): void {
        if(this.started) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
    }

    getUnitState(unit: Unit): UnitState {
        throw new Error("Method not implemented.");
    }

    static fromCreateRequest(data: CreateGameRequest): Game {
        const game = new Game();
        return game;
	}
}