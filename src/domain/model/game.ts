import Field from "./field";
import Player from "./player";
import Unit from "./unit";

export default class Game {
    id?: string;
    field?: Field;
    players: Player[];
    private unitsPerPlayer: Map<string,Unit[]>;

    constructor() {
        this.players = [];
        this.unitsPerPlayer = new Map<string,Unit[]>();
    }

    addPlayer(player: Player) {
        this.players.push(player);
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
}