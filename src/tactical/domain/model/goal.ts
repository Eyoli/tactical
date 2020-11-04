import Game from "./game";
import Player from "./player";

export interface Goal {
    reached(game: Game): boolean;
}

export class KillThemAll implements Goal {

    constructor(
        readonly candidate: Player) {
    }

    reached(game: Game): boolean {
        return !game.players
            .filter(player => player.id !== this.candidate.id)
            .flatMap(player => game.getUnits(player))
            .map(unit => game.getUnitState(unit.id))
            .some(unitState => !unitState.isDead());
    }
}