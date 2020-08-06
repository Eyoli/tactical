import { IGameService, IMovementService, IPlayerService, IUnitService } from "../port/primary/services";
import Game from "../model/game";
import { inject, injectable } from "inversify";
import Repository from "../port/secondary/repository";
import * as UUID from "uuid";
import { TYPES } from "../../types";
import Field from "../model/field";
import ResourceNotFoundError from "../error/resource-not-found-error";
import GameError from "../error/game-error";
import Tile from "../model/tile";
import { Set } from "immutable";
import Position from "../model/position";

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

    finishTurn(gameId: string): Game {
        const game = this.getGame(gameId);
        game.finishTurn();
        this.gameRepository.update(game, gameId);
        return game;
    }

    startGame(gameId: string): Game {
        const game = this.getGame(gameId);
        if(game.hasStarted()) {
            throw new GameError("GAME_ALREADY_STARTED", "Game has already started");
        }
        
        game.start();
        this.gameRepository.update(game, gameId);
        return game;
    }

    createGame(game: Game, fieldId: string): string {
        game.id = UUID.v4();

        const field = this.fieldRepository.load(fieldId);
        if(!field) {
            throw new ResourceNotFoundError(Field);
        }
        game.field = field;

        this.gameRepository.save(game, game.id);
        return game.id;
    }

    getGame(key: string): Game {
        const game = this.gameRepository.load(key);
        if(!game) {
            throw new ResourceNotFoundError(Game);
        }
        return game;
    }

    getGames(): Game[] {
        return this.gameRepository.loadAll();
    }

    addPlayer(gameId: string, playerId: string): Game {
        const game = this.getGame(gameId);
        const player = this.playerService.getPlayer(playerId);

        game.addPlayers(player);
        this.gameRepository.update(game, gameId);

        return game;
    }

    setUnits(gameId: string, playerId: string, unitIds: string[]): Game {
        const game = this.getGame(gameId);
        const player = this.playerService.getPlayer(playerId);
        const units = this.unitService.getUnits(unitIds);

        game.setUnits(player, units);
        this.gameRepository.update(game, gameId);

        return game;
    }

    getAccessiblePositions(gameId: string, unitId: string): Position[] {
        const game = this.getGame(gameId);
        const unit = this.unitService.getUnit(unitId);
        return this.movementService.getAccessiblePositions(game?.field, game.getUnitState(unit));
    }
}