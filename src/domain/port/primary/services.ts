import Field from "../../model/field";
import Player from "../../model/player";
import Game from "../../model/game";
import Unit from "../../model/unit";

export interface IFieldService {
    createField(field: Field): string;
    getField(id: string): Field;
    getFields(): Field[];
}

export interface IGameService {
    createGame(game: Game, fieldId: string): string;
    getGame(id: string): Game;
    getGames(): Game[];
    addPlayer(gameId: string, playerId: string): Game;
    setUnits(gameId: string, playerId: string, unitIds: string[]): Game;
}

export interface IPlayerService {
    createPlayer(player: Player): string;
    getPlayer(id: string): Player;
    getPlayers(): Player[];
}

export interface IUnitService {
    createUnit(unit: Unit): string;
    getUnit(id: string): Unit;
    getUnits(): Unit[];
}