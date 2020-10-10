import { GameServicePort, FieldAlgorithmServicePort, PlayerServicePort, UnitServicePort, ActionServicePort } from "../../domain/port/primary/services";
import Game from "../../domain/model/game";
import { inject, injectable } from "inversify";
import RepositoryPort from "../../domain/port/secondary/repository-port";
import { TYPES } from "../../../types";
import Field from "../model/field/field";
import ResourceNotFoundError from "../../domain/model/error/resource-not-found-error";
import Position from "../../domain/model/position";
import UnitState from "../../domain/model/unit-state";
import { UnitsComposition, UnitsPlacement } from "../../domain/model/types";
import { GameError, GameErrorCode } from "../../domain/model/error/game-error";
import Player from "../../domain/model/player";
import { ActionType } from "../../domain/model/action/action-type";
import { Direction } from "../../domain/model/enums";

@injectable()
export default class GameService implements GameServicePort {
    private gameRepository: RepositoryPort<Game>;
    private playerService: PlayerServicePort;
    private unitService: UnitServicePort;
    private fieldRepository: RepositoryPort<Field<Position>>;
    private fieldAlgorithmService: FieldAlgorithmServicePort;
    private actionService: ActionServicePort;

    constructor(
        @inject(TYPES.GAME_REPOSITORY) gameRepository: RepositoryPort<Game>,
        @inject(TYPES.PLAYER_SERVICE) playerService: PlayerServicePort,
        @inject(TYPES.UNIT_SERVICE) unitService: UnitServicePort,
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: RepositoryPort<Field<Position>>,
        @inject(TYPES.FIELD_ALGORITHM_SERVICE) fieldAlgorithmService: FieldAlgorithmServicePort,
        @inject(TYPES.ACTION_SERVICE) actionService: ActionServicePort) {
        this.gameRepository = gameRepository;
        this.playerService = playerService;
        this.unitService = unitService;
        this.fieldRepository = fieldRepository;
        this.fieldAlgorithmService = fieldAlgorithmService;
        this.actionService = actionService;
    }

    createGame(game: Game, fieldId: string): string {
        const field = this.fieldRepository.load(fieldId);
        if (!field) {
            throw new ResourceNotFoundError("Field");
        }
        game.field = field;

        game.id = this.gameRepository.save(game);
        return game.id;
    }

    finishTurn(gameId: string): Game {
        const game = this.getGame(gameId);
        game.finishTurn();
        this.gameRepository.update(game, gameId);
        return game;
    }

    startGame(gameId: string, unitsComposition: UnitsComposition): Game {
        const game = this.getGame(gameId);
        if (game.hasStarted()) {
            throw new GameError(GameErrorCode.GAME_ALREADY_STARTED);
        }
        if (game.players.length < 2) {
            throw new GameError(GameErrorCode.NOT_ENOUGH_PLAYERS);
        }

        const hasInvalidPosition = Array.from(unitsComposition.values()).some(
            unitsPosition => Array.from(unitsPosition.values()).some(
                position => !game.field?.isValidPosition(position)));
        if (hasInvalidPosition) {
            throw new GameError(GameErrorCode.INVALID_POSITION);
        }

        for (const player of game.players) {
            const playerComposition = unitsComposition.get(player.id);
            if (playerComposition) {
                this.initUnitsState(game, player, playerComposition);
            }
        }

        if (game.players
            .map(player => game.getUnits(player))
            .some(units => !units || units.length < 1)) {
            throw new GameError(GameErrorCode.NOT_ENOUGH_UNITS);
        }

        game.start();
        this.gameRepository.update(game, gameId);
        return game;
    }

    getGame(key: string): Game {
        const game = this.gameRepository.load(key);
        if (!game) {
            throw ResourceNotFoundError.fromClass(Game);
        }
        return game;
    }

    getGames(): Game[] {
        return this.gameRepository.loadAll();
    }

    addPlayers(gameId: string, playerId: string[]): Game {
        const game = this.getGame(gameId);
        const players = playerId
            .map(id => this.playerService.getPlayer(id));

        game.addPlayers(...players);
        this.gameRepository.update(game, gameId);

        return game;
    }

    private initUnitsState(game: Game, player: Player, unitsPositions: UnitsPlacement): void {
        const units = this.unitService.getUnits(Array.from(unitsPositions.keys()));

        game.setUnits(player, units);
        units.forEach(unit => {
            const position = unitsPositions.get(unit.id);
            if (position) {
                game.integrate(false, UnitState.init(unit, position, Direction.DOWN));
            }
        });
    }

    getPositionsInRange(gameId: string, unitId: string, actionType: ActionType): Position[] {
        const game = this.getGame(gameId);
        const unitState = game.getUnitState(unitId);
        if (unitState) {
            const range = actionType.range || unitState.unit.getWeapon().range;
            return this.fieldAlgorithmService.getPositionsInRange(
                game.field, unitState.position, range);
        }
        return [];
    }

    getAccessiblePositions(gameId: string, unitId: string): Position[] {
        const game = this.getGame(gameId);
        const unitState = game.getUnitState(unitId);
        if (unitState) {
            return this.fieldAlgorithmService.getAccessiblePositions(game.field, unitState);
        }
        return [];
    }

    actOnPosition(gameId: string, srcUnitId: string, position: Position, actionTypeId: string): UnitState[] {
        const game = this.getGame(gameId);
        if (!game.hasStarted()) {
            throw new GameError(GameErrorCode.GAME_NOT_STARTED);
        }

        const srcUnit = game.getUnit(srcUnitId);
        if (game.canAct(srcUnit)) {
            const actionType = this.actionService.getActionType(actionTypeId);
            const srcUnitState = game.getUnitState(srcUnitId).acting();

            const positions: Position[] = [];
            if (actionType.area) {
                positions.push(...this.fieldAlgorithmService.getPositionsInRange(
                    game.field, position, actionType.area!));
            } else {
                positions.push(position);
            }

            const targetUnitStates: UnitState[] = [];
            positions.map(p => game.findUnitState(p))
                .forEach(unitState => {
                    if (unitState) {
                        targetUnitStates.push(unitState);
                    }
                });

            if (targetUnitStates.length < 1) {
                // Not an error, but this action will not do anything
                game.integrate(true, srcUnitState);
                this.gameRepository.update(game, gameId);
                return [srcUnitState];
            }

            game.integrate(false, srcUnitState);
            const newStates: UnitState[] = [];
            targetUnitStates.forEach(targetUnitState => {
                const action = this.actionService.generateAction(actionType, srcUnitState!, targetUnitState);
                if (action.validate() === true) {
                    const actionResult = action.apply();
                    game.integrate(true, ...actionResult);
                    this.gameRepository.update(game, gameId);
                    newStates.push(...actionResult);
                }
            })
            return newStates;

        }
        throw new GameError(GameErrorCode.IMPOSSIBLE_TO_ACT);
    }

    moveUnit(gameId: string, unitId: string, p: Position): UnitState {
        const game = this.getGame(gameId);
        if (!game.hasStarted()) {
            throw new GameError(GameErrorCode.GAME_NOT_STARTED);
        }

        const unit = game.getUnit(unitId);
        const unitState = game.getUnitState(unitId);

        if (!game.canMove(unit)) {
            throw new GameError(GameErrorCode.IMPOSSIBLE_TO_MOVE_UNIT);
        }

        if (!this.fieldAlgorithmService.isAccessible(game.field, unitState!, p)) {
            throw new GameError(GameErrorCode.UNREACHABLE_POSITION);
        }

        const path = this.fieldAlgorithmService.getShortestPath(
            game.field, unitState.position, p, unitState.getJumps());
        const newUnitState = unitState!.movingTo(p, path);
        game.integrate(true, newUnitState);
        this.gameRepository.update(game, gameId);
        return newUnitState;
    }

    rollbackLastAction(gameId: string): Game {
        const game = this.getGame(gameId);
        game.rollbackLastAction();
        this.gameRepository.update(game, gameId);
        return game;
    }
}