import { IGameService, IMovementService, IPlayerService, IUnitService } from "../port/primary/services";
import Game from "../model/game";
import { inject, injectable } from "inversify";
import Repository from "../port/secondary/repository";
import { TYPES } from "../../types";
import Field from "../model/field";
import ResourceNotFoundError from "../error/resource-not-found-error";
import Position from "../model/position";
import { UnitStateBuilder, UnitState } from "../model/unit-state";
import { UnitsComposition, UnitsPlacement } from "../model/aliases";
import { GameError, GameErrorCode } from "../error/game-error";

@injectable()
export default class GameService implements IGameService {
    private gameRepository: Repository<Game>;
    private playerService: IPlayerService;
    private unitService: IUnitService;
    private fieldRepository: Repository<Field>;
    private movementService: IMovementService;

    constructor(
        @inject(TYPES.GAME_REPOSITORY) gameRepository: Repository<Game>,
        @inject(TYPES.PLAYER_SERVICE) playerService: IPlayerService,
        @inject(TYPES.UNIT_SERVICE) unitService: IUnitService,
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: Repository<Field>,
        @inject(TYPES.MOVEMENT_SERVICE) movementService: IMovementService) {
        this.gameRepository = gameRepository;
        this.playerService = playerService;
        this.unitService = unitService;
        this.fieldRepository = fieldRepository;
        this.movementService = movementService;
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

        unitsComposition.forEach(
            (unitsPosition, playerId) => this.setUnits(gameId, playerId, unitsPosition));

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

    private setUnits(gameId: string, playerId: string, unitsPositions: UnitsPlacement): void {
        const game = this.getGame(gameId);
        const player = this.playerService.getPlayer(playerId);
        const units = this.unitService.getUnits(Array.from(unitsPositions.keys()));

        game.setUnits(player, units);
        units.forEach(unit => {
            const position = unitsPositions.get(unit.id);
            if(position) {
                game.setUnitState(unit,new UnitStateBuilder().init(unit, position).build());
            }
        });
    }

    getAccessiblePositions(gameId: string, unitId: string): Position[] {
        const game = this.getGame(gameId);
        const unit = this.unitService.getUnit(unitId);
        const unitState = game.getUnitState(unit);
        if(game.field && unitState) {
            return this.movementService.getAccessiblePositions(game?.field, unitState);
        }
        return [];
    }

    moveUnit(gameId: string, unitId: string, p: Position): UnitState {
        const game = this.getGame(gameId);
        const unit = this.unitService.getUnit(unitId);
        const unitState = game.getUnitState(unit);

        if(game.canAct(unit) && this.movementService.isAccessible(game.field, unitState!, p)) {
            const newUnitState = new UnitStateBuilder().fromState(unitState!).movingTo(p).build();
            game.setUnitState(unit, newUnitState);
            return newUnitState;
        }
        throw new GameError(GameErrorCode.IMPOSSIBLE_TO_MOVE_UNIT);
    }
}