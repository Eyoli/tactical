import Field from "../../model/field";
import Player from "../../model/player";
import Game from "../../model/game";
import Unit from "../../model/unit";
import Position from "../../model/position";
import UnitState from "../../model/unit-state";
import Action from "../../model/action/action";
import { ActionType } from "../../model/action/action-type";

export interface FieldServicePort<T extends Field> {
    createField(field: T): string;
    getField(id: string): T;
    getFields(): T[];
}

export interface GameServicePort {
    finishTurn(gameId: string): Game;
    startGame(gameId: string, unitsComposition: Map<string, Map<string, Position>>): Game;
    createGame(game: Game, fieldId: string): string;
    getGame(id: string): Game;
    getGames(): Game[];
    addPlayers(gameId: string, playerIds: string[]): Game;
    getAccessiblePositions(gameId: string, unitId: string): Position[];
    actOnTarget(gameId: string, srcUnitId: string, targetUnitId: string, actionType: ActionType): UnitState[];
    moveUnit(gameId: string, unitId: string, p: Position): UnitState;
    rollbackLastAction(gameId: string): void;
}

export interface ActionServicePort {
    generateActionOnTarget(srcUnitState: UnitState, targetUnitState: UnitState, actionType: ActionType): Action;
}

export interface PlayerServicePort {
    createPlayer(player: Player): string;
    getPlayer(id: string): Player;
    getPlayers(): Player[];
}

export interface UnitServicePort {
    createUnit(unit: Unit): string;
    getUnit(id: string): Unit;
    getUnits(ids?: string[]): Unit[];
}

export interface MovementServicePort {
    isAccessible(field: Field | undefined, unit: UnitState, p: Position): boolean;
    getAccessiblePositions(field: Field, unitState: UnitState): Position[];
}