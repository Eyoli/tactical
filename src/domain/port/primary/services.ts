import Field from "../../model/field";
import Player from "../../model/player";
import Game from "../../model/game";
import Unit from "../../model/unit";
import Position from "../../model/position";
import { UnitState } from "../../model/unit-state";

export interface IFieldService {
    createField(field: Field): string;
    getField(id: string): Field;
    getFields(): Field[];
}

export interface IGameService {
    finishTurn(gameId: string): Game;
    startGame(gameId: string, unitsComposition: Map<string, Map<string, Position>>): Game;
    createGame(game: Game, fieldId: string): string;
    getGame(id: string): Game;
    getGames(): Game[];
    addPlayers(gameId: string, playerIds: string[]): Game;
    getAccessiblePositions(gameId: string, unitId: string): Position[];
    moveUnit(gameId: string, playerId: string, unitId: string, p: Position): UnitState;
}

export interface IPlayerService {
    createPlayer(player: Player): string;
    getPlayer(id: string): Player;
    getPlayers(): Player[];
}

export interface IUnitService {
    createUnit(unit: Unit): string;
    getUnit(id: string): Unit;
    getUnits(ids?: string[]): Unit[];
}

export interface IMovementService {
    isAccessible(field: Field | undefined, unit: UnitState, p: Position): boolean;
    getAccessiblePositions(field: Field, unitState: UnitState): Position[];
}