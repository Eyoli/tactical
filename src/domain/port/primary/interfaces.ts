import Field from "../../model/field";
import Player from "../../model/player";
import Game from "../../model/game";

export interface IFieldService {
    createField(field: Field): string;
    getField(id: string): Field;
    getFields(): Field[];
}

export interface IGameService {
    createGame(game: Game): string;
    getGame(id: string): Game;
    setUnits(gameId: string, playerId: string, unitIds: string[]): void;
}

export interface IPlayerService {
    createPlayer(player: Player): string;
    getPlayer(id: string): Player;
}