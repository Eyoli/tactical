import { GameServicePort as GameServicePort, MovementServicePort as MovementServicePort, PlayerServicePort as PlayerServicePort, UnitServicePort as UnitServicePort, ActionServicePort as ActionServicePort } from "../port/primary/services";
import Game from "../model/game";
import { inject, injectable } from "inversify";
import RepositoryPort from "../port/secondary/repository";
import { TYPES } from "../../types";
import Field from "../model/field";
import ResourceNotFoundError from "../error/resource-not-found-error";
import Position from "../model/position";
import UnitState from "../model/unit-state";
import { UnitsComposition, UnitsPlacement } from "../model/aliases";
import { GameError, GameErrorCode } from "../error/game-error";
import { ActionType } from "../model/action/action-type";
import Player from "../model/player";

@injectable()
export default class GameService implements GameServicePort {
    private gameRepository: RepositoryPort<Game>;
    private playerService: PlayerServicePort;
    private unitService: UnitServicePort;
    private fieldRepository: RepositoryPort<Field>;
    private movementService: MovementServicePort;
    private actionService: ActionServicePort;

    constructor(
        @inject(TYPES.GAME_REPOSITORY) gameRepository: RepositoryPort<Game>,
        @inject(TYPES.PLAYER_SERVICE) playerService: PlayerServicePort,
        @inject(TYPES.UNIT_SERVICE) unitService: UnitServicePort,
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: RepositoryPort<Field>,
        @inject(TYPES.MOVEMENT_SERVICE) movementService: MovementServicePort,
        @inject(TYPES.ACTION_SERVICE) actionService: ActionServicePort) {
        this.gameRepository = gameRepository;
        this.playerService = playerService;
        this.unitService = unitService;
        this.fieldRepository = fieldRepository;
        this.movementService = movementService;
        this.actionService = actionService;
    }

    createGame(game: Game, fieldId: string): string {
        const field = this.fieldRepository.load(fieldId);
        if(!field) {
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
        if(game.hasStarted()) {
            throw new GameError(GameErrorCode.GAME_ALREADY_STARTED);
        }
        if(game.players.length < 2) {
            throw new GameError(GameErrorCode.NOT_ENOUGH_PLAYERS);
        }

        const hasInvalidPosition = Array.from(unitsComposition.values()).some(
            unitsPosition => Array.from(unitsPosition.values()).some(
                position => !game.field?.isValidPosition(position)));
        if(hasInvalidPosition) {
            throw new GameError(GameErrorCode.INVALID_POSITION);
        }

        game.players.forEach(
            player => this.initUnitsState(game, player, unitsComposition.get(player.id)!));

        if(game.players
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
        if(!game) {
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
            if(position) {
                game.integrate(false, new UnitState.Builder().init(unit, position).build());
            }
        });
    }

    getAccessiblePositions(gameId: string, unitId: string): Position[] {
        const game = this.getGame(gameId);
        const unitState = game.getUnitState(unitId);
        if(game.field && unitState) {
            return this.movementService.getAccessiblePositions(game?.field, unitState);
        }
        return [];
    }

    actOnTarget(gameId: string, srcUnitId: string, targetUnitId: string, actionType: ActionType): UnitState[] {
        const game = this.getGame(gameId);
        if(!game.hasStarted()) {
            throw new GameError(GameErrorCode.GAME_NOT_STARTED);
        }

        const srcUnit = game.getUnit(srcUnitId);
        if (game.canAct(srcUnit)) {
            const srcUnitState = new UnitState.Builder().fromState(game.getUnitState(srcUnitId))
                .acting().build();
                game.integrate(false, srcUnitState);
            const targetUnitState = game.getUnitState(targetUnitId);
            const action = this.actionService.generateActionOnTarget(srcUnitState!, targetUnitState!, actionType);
            const newStates = action.apply();
            game.integrate(true, ...newStates);
            this.gameRepository.update(game, gameId);

            return newStates;
        }
        throw new GameError(GameErrorCode.IMPOSSIBLE_TO_ACT);
    }

    moveUnit(gameId: string, unitId: string, p: Position): UnitState {
        const game = this.getGame(gameId);
        if(!game.hasStarted()) {
            throw new GameError(GameErrorCode.GAME_NOT_STARTED);
        }
        
        const unit = game.getUnit(unitId);
        const unitState = game.getUnitState(unitId);

        if(game.canMove(unit) && this.movementService.isAccessible(game.field, unitState!, p)) {
            const newUnitState = new UnitState.Builder().fromState(unitState!).movingTo(p).build();
            game.integrate(true, newUnitState);
            this.gameRepository.update(game, gameId);

            return newUnitState;
        }
        throw new GameError(GameErrorCode.IMPOSSIBLE_TO_MOVE_UNIT);
    }

    rollbackLastAction(gameId: string): void {
        const game = this.getGame(gameId);
        game.rollbackLastAction();
    }
}