import { IGameService } from "../port/primary/services";
import Player from "../model/player";
import Game from "../model/game";
import { inject, injectable } from "inversify";
import Repository from "../port/secondary/repository";
import * as UUID from "uuid";
import Unit from "../model/unit";
import { TYPES } from "../../types";
import Field from "../model/field";
import ResourceNotFoundError from "../error/resource-not-found-error";
import GameError from "../error/game-error";

@injectable()
export default class GameService implements IGameService {
    private gameRepository: Repository<Game>;
    private playerRepository: Repository<Player>;
    private unitRepository: Repository<Unit>;
    private fieldRepository: Repository<Unit>;

    constructor(
        @inject(TYPES.GAME_REPOSITORY) gameRepository: Repository<Game>,
        @inject(TYPES.PLAYER_REPOSITORY) playerRepository: Repository<Player>,
        @inject(TYPES.UNIT_REPOSITORY) unitRepository: Repository<Unit>,
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: Repository<Field>) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.unitRepository = unitRepository;
        this.fieldRepository = fieldRepository;
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
        const player = this.getPlayer(playerId);

        game.addPlayers(player);
        this.gameRepository.update(game, gameId);

        return game;
    }

    setUnits(gameId: string, playerId: string, unitIds: string[]): Game {
        const game = this.getGame(gameId);
        const player = this.getPlayer(playerId);

        const units = this.unitRepository.loadSome(unitIds);
        if(units.length !== unitIds.length) {
            throw new Error("At least one invalid unit");
        }

        game.setUnits(player, units);
        this.gameRepository.update(game, gameId);

        return game;
    }
    
    private getPlayer(playerId: string): Player {
        const player = this.playerRepository.load(playerId);
        if(!player) {
            throw new ResourceNotFoundError(Player);
        }
        return player;
    }
}