import Field from "../../model/field";
import Player from "../../model/player";
import Game from "../../model/game";
import Unit from "../../model/unit";
import Position from "../../model/position";
import UnitState from "../../model/unit-state";
import Action from "../../model/action/action";
import { ActionType, Range } from "../../model/action/action-type";

export interface FieldServicePort<T extends Field> {
    createField(field: T): string;
    updateField(field: T, id: string): void;
    getField(id: string): T;
    getFields(): T[];
}

export interface GameServicePort {
	getPositionsInRange(gameId: string, unitId: string, actionType: ActionType): Position[];
    finishTurn(gameId: string): Game;
    startGame(gameId: string, unitsComposition: Map<string, Map<string, Position>>): Game;
    createGame(game: Game, fieldId: string): string;
    getGame(id: string): Game;
    getGames(): Game[];
    addPlayers(gameId: string, playerIds: string[]): Game;
    getAccessiblePositions(gameId: string, unitId: string): Position[];
    actOnPosition(gameId: string, srcUnitId: string, position: Position, actionTypeId: string): UnitState[];
    moveUnit(gameId: string, unitId: string, p: Position): UnitState;
    rollbackLastAction(gameId: string): Game;
}

export interface ActionServicePort {
    getActionType(id: string): ActionType;
    generateAction(actionType: ActionType, srcUnitState: UnitState, targetUnitState: UnitState): Action;
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

export interface FieldAlgorithmServicePort {
    getShortestPath(field: Field, position: Position, p: Position, jumps: number): Position[];
    isAccessible(field: Field, unitState: UnitState, p: Position): boolean;
    getAccessiblePositions(field: Field, unitState: UnitState): Position[];
    getPositionsInRange(field: Field, position: Position, range: Range): Position[];
}